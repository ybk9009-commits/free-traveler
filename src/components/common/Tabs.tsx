"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface TabsProps {
  /** tablist의 aria-label. 화면에 보이는 Section 제목과 중복되어도 된다. */
  label: string;
  items: TabItem[];
  /** 지정하면 controlled(활성 탭을 부모가 관리)로 동작한다. */
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

/**
 * D-001 § Form·Tabs — tab-underline 단일 패턴.
 * 탭 전환 시 다른 탭의 입력 상태를 세션 동안 유지해야 하므로(D-001),
 * 비활성 패널도 unmount하지 않고 `hidden`으로만 감춘다.
 */
export function Tabs({
  label,
  items,
  activeId,
  defaultActiveId,
  onChange,
}: TabsProps) {
  const baseId = useId();
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? items[0]?.id,
  );
  const isControlled = activeId !== undefined;
  const currentId = isControlled ? activeId : internalActiveId;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function selectTab(id: string) {
    if (!isControlled) setInternalActiveId(id);
    onChange?.(id);
  }

  function focusTabAt(index: number) {
    const target = items[index];
    if (target) tabRefs.current[target.id]?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const next = (index + 1) % items.length;
        focusTabAt(next);
        selectTab(items[next].id);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const prev = (index - 1 + items.length) % items.length;
        focusTabAt(prev);
        selectTab(items[prev].id);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusTabAt(0);
        selectTab(items[0].id);
        break;
      }
      case "End": {
        event.preventDefault();
        focusTabAt(items.length - 1);
        selectTab(items[items.length - 1].id);
        break;
      }
      default:
        break;
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-6 border-b border-[#E3E2DE]"
      >
        {items.map((item, index) => {
          const selected = item.id === currentId;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex min-h-[44px] items-center px-1 text-[15px] font-semibold leading-[1.4] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                selected
                  ? "border-b-2 border-[#F4623A] text-[#2A2A2E]"
                  : "border-b-2 border-transparent text-[#6B6B72]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === currentId;
        return (
          <div
            key={item.id}
            id={`${baseId}-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${item.id}`}
            hidden={!selected}
            tabIndex={selected ? 0 : -1}
          >
            {item.panel}
          </div>
        );
      })}
    </div>
  );
}
