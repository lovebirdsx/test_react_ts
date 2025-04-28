import React, { useRef, useCallback } from 'react';

type Props = {
  orientation: 'vertical' | 'horizontal';
  onResize: (delta: number) => void;
  startOffset: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export function Divider({ orientation, onResize, startOffset, top = 0, bottom = 0, left = 0, right = 0 }: Props) {
  const dragging = useRef(false);

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = orientation === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [orientation]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) {
        return;
      }

      const delta = orientation === 'vertical' ? e.movementX : e.movementY;
      onResize(delta);
    },
    [onResize, orientation],
  );

  const onMouseUp = useCallback((e: MouseEvent) => {
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const style: React.CSSProperties = {
    position: 'absolute',
    ...(orientation === 'vertical'
      ? { top, bottom, left: startOffset - 2, width: 4, cursor: 'ew-resize' }
      : { left, right, top: startOffset - 2, height: 4, cursor: 'ns-resize' }),
    zIndex: 10,
  };

  return <div style={style} onMouseDown={onMouseDown} />;
}
