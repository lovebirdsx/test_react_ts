import * as React from 'react';
import { create } from 'zustand';

// 定义每个 peek 窗口状态的结构
interface PeekState {
  id: number;
  isVisible: boolean;
  rect: DOMRect;
  element: JSX.Element;
}

// 定义带有堆栈操作的 store 接口
interface PeekStore {
  peekStack: PeekState[];
  pushPeek: (state: Omit<PeekState, 'id' | 'isVisible'>) => void;
  popPeek: () => void;
  removePeek: (id: number) => void;
}

// 创建 Zustand store
const usePeekStore = create<PeekStore>((set) => ({
  peekStack: [],
  pushPeek: (state) => {
    const id = Date.now(); // 简单的唯一 ID
    set((prev) => ({
      peekStack: [...prev.peekStack, { id, isVisible: true, ...state }],
    }));
  },
  popPeek: () => {
    set((prev) => ({
      peekStack: prev.peekStack.slice(0, -1),
    }));
  },
  removePeek: (id) => {
    set((prev) => ({
      peekStack: prev.peekStack.filter((peek) => peek.id !== id),
    }));
  },
}));

// 更新 PeekComponent 的 props 以包含完整的 DOMRect
interface PeekComponentProps {
  id: number;
  element: JSX.Element;
  isTopMost: boolean;
  rect: DOMRect; // 被点击元素的边界矩形
  onClose: () => void;
}

/**
 * 计算弹窗的位置
 * @param rect 弹窗的触发元素的位置
 * @param peekWidth 弹窗的宽度
 * @param peekHeight 弹窗的高度
 * @param screenWidth 屏幕的宽度
 * @param screenHeight 屏幕的高度
 * @returns { x: number; y: number } 弹窗的坐标
 */
const calculatePosition = (
  rect: DOMRect,
  peekWidth: number,
  peekHeight: number,
  screenWidth: number,
  screenHeight: number,
): { x: number; y: number } => {
  const margin = 2;

  let x = rect.right + margin;
  let y = rect.top;

  // 检查右边是否有足够空间
  const fitsRight = rect.right + margin + peekWidth <= screenWidth;
  if (fitsRight) {
    return {
      x: rect.right + margin,
      y: rect.top + peekHeight > screenHeight ? screenHeight - peekHeight : rect.top,
    };
  }

  // 检查下方是否有足够空间
  const fitsBelow = rect.bottom + margin + peekHeight <= screenHeight;
  if (fitsBelow) {
    return {
      x: rect.right + peekWidth > screenWidth ? screenWidth - peekWidth : rect.right,
      y: rect.bottom + margin,
    };
  }

  // 检查上方是否有足够空间
  const fitsAbove = rect.top - margin - peekHeight >= 0;
  if (fitsAbove) {
    return {
      x: rect.left + peekWidth > screenWidth ? screenWidth - peekWidth : rect.left,
      y: rect.top - peekHeight,
    };
  }

  // 检查左边是否有足够空间
  const fitsLeft = rect.left - margin - peekWidth >= 0;
  if (fitsLeft) {
    return {
      x: rect.left - peekWidth,
      y: rect.top + peekHeight > screenHeight ? screenHeight - peekHeight : rect.top,
    };
  }

  // 如果所有位置都不合适，居中显示
  x = (screenWidth - peekWidth) / 2;
  y = (screenHeight - peekHeight) / 2;
  return { x, y };
};

// PeekComponent 现在根据优先级处理自己的定位逻辑
const PeekComponent: React.FC<PeekComponentProps> = ({
  id,
  element,
  rect, // 被点击元素的 DOMRect
  onClose,
  isTopMost,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState<{ x: number; y: number }>({
    x: rect.right + 2,
    y: rect.top,
  });

  React.useEffect(() => {
    if (!isTopMost) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (isTopMost && ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isTopMost]);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const peekWidth = ref.current.offsetWidth;
      const peekHeight = ref.current.offsetHeight;

      const bestPosition = calculatePosition(rect, peekWidth, peekHeight, window.innerWidth, window.innerHeight);
      if (bestPosition.x !== adjustedPosition.x || bestPosition.y !== adjustedPosition.y) {
        setAdjustedPosition(bestPosition);
      }
    }
  }, [rect, adjustedPosition]);

  return (
    <div
      id={`context-menu-${id}`}
      ref={ref}
      className="vsplay-peek-component"
      style={{
        position: 'fixed',
        top: adjustedPosition.y,
        left: adjustedPosition.x,
        zIndex: 1000 + id, // 确保堆叠顺序
      }}
    >
      {element}
    </div>
  );
};

// 提供者组件，渲染堆栈中的所有 peek 组件
const PeekComponentProvider: React.FC = () => {
  const { peekStack, removePeek } = usePeekStore();

  return (
    <>
      {peekStack.map((peek) =>
        peek.isVisible ? (
          <PeekComponent
            key={peek.id}
            id={peek.id}
            isTopMost={peek === peekStack[peekStack.length - 1]}
            element={peek.element}
            rect={peek.rect}
            onClose={() => removePeek(peek.id)}
          />
        ) : null,
      )}
    </>
  );
};

// 更新 handlePeek 以将新的 peek 窗口推入堆栈
function handlePeek(e: React.MouseEvent, element: JSX.Element): void {
  e.stopPropagation();
  e.preventDefault();

  // 获取点击目标的边界矩形以避免重叠
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  usePeekStore.getState().pushPeek({
    element,
    rect,
  });
}

// 示例 peek 窗口组件
const PeekWindow: React.FC = () => {
  return (
    <div style={{ width: '300px', height: '200px', background: 'white', border: '1px solid #ccc', padding: '10px' }}>
      <div>Peek Window</div>
      <button onClick={(event) => handlePeek(event, <PeekWindow />)}>Open Nested Peek</button>
    </div>
  );
};

const TIPS = `测试弹出窗口的使用：
* 窗口弹出的位置会自动调整以避免重叠
* 点击窗口外部会关闭窗口
* 支持嵌套弹出窗口
`;

// 导出的组件，包含提供者和打开 peek 窗口的按钮
export const TestPeekComponent: React.FC = () => {
  return (
    <div>
      <section className="test-section">
        <pre>{TIPS}</pre>
      </section>
      <PeekComponentProvider />
      <button onClick={(event) => handlePeek(event, <PeekWindow />)}>Open PeekWindow</button>
    </div>
  );
};
