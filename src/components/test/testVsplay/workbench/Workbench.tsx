import './workbench.css';

import { useEffect, useRef, useState } from 'react';
import { classNames } from '../base/browser/class';
import { useWorkbenchStore } from './context/Store';
import { EPart } from './store/slice/parts';
import { Divider } from './common/components/Divider';

const partId2Class: Record<EPart, string> = {
  [EPart.TitleBar]: 'part--title',
  [EPart.ActivityBar]: 'part--activity',
  [EPart.LeftSideBar]: 'part--left',
  [EPart.RightSideBar]: 'part--right',
  [EPart.Editor]: 'part--editor',
  [EPart.Panel]: 'part--panel',
  [EPart.StatusBar]: 'part--status',
};

function Part(props: { id: EPart }) {
  const part = useWorkbenchStore((state) => state.parts[props.id]);
  if (!part.isVisible) {
    return <></>;
  }

  const { component: Component } = part;
  const className = classNames('part', partId2Class[props.id]);

  return <div className={className}>{Component ? <Component /> : part.id}</div>;
}

export function Workbench() {
  const workbenchRef = useRef<HTMLDivElement>(null);
  const [workbenchWidth, setWorkbenchWidth] = useState(0);
  const [workbenchHeight, setWorkbenchHeight] = useState(0);

  const {
    titleHeight,
    statusHeight,
    activityWidth,
    leftWidth,
    rightWidth,
    panelHeight,
    setLeftWidth,
    setRightWidth,
    setPanelHeight,
  } = useWorkbenchStore((state) => ({
    titleHeight: state.layout.titleHeight,
    statusHeight: state.layout.statusHeight,
    activityWidth: state.layout.activityWidth,
    leftWidth: state.layout.leftWidth,
    rightWidth: state.layout.rightWidth,
    panelHeight: state.layout.panelHeight,
    setLeftWidth: state.layout.setLeftWidth,
    setRightWidth: state.layout.setRightWidth,
    setPanelHeight: state.layout.setPanelHeight,
  }));

  useEffect(() => {
    const measure = () => {
      if (workbenchRef.current) {
        setWorkbenchWidth(workbenchRef.current.offsetWidth);
        setWorkbenchHeight(workbenchRef.current.offsetHeight);
      }
    };

    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [setWorkbenchWidth, setWorkbenchHeight]);

  const rootStyle = {
    '--title-height': `${titleHeight}px`,
    '--status-height': `${statusHeight}px`,
    '--activity-width': `${activityWidth}px`,
    '--left-width': `${leftWidth}px`,
    '--right-width': `${rightWidth}px`,
    '--panel-height': `${panelHeight}px`,
  } as React.CSSProperties & Record<string, string | number>;

  const rightDividerOffset = workbenchWidth > 0 ? workbenchWidth - rightWidth : 0;
  const bottomDividerOffset = workbenchHeight - statusHeight - panelHeight;

  return (
    <div className="workbench" style={rootStyle} ref={workbenchRef}>
      <Part id={EPart.TitleBar} />
      <Part id={EPart.ActivityBar} />
      <Part id={EPart.LeftSideBar} />
      <Part id={EPart.Editor} />
      <Part id={EPart.RightSideBar} />
      <Part id={EPart.Panel} />
      <Part id={EPart.StatusBar} />

      <Divider
        orientation="vertical"
        startOffset={activityWidth + leftWidth}
        onResize={(dx) => setLeftWidth(Math.max(100, leftWidth + dx))}
        top={titleHeight}
        bottom={statusHeight}
      />
      <Divider
        orientation="vertical"
        startOffset={rightDividerOffset}
        onResize={(dx) => setRightWidth(Math.max(100, rightWidth - dx))}
        top={titleHeight}
        bottom={statusHeight}
      />
      <Divider
        orientation="horizontal"
        startOffset={bottomDividerOffset}
        onResize={(dy) => setPanelHeight(Math.max(80, panelHeight - dy))}
        left={activityWidth + leftWidth}
        right={rightWidth}
      />
    </div>
  );
}
