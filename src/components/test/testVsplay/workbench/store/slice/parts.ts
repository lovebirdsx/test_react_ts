import { StateCreator } from 'zustand';
import React from 'react';
import { IWorkbenchStoreOptions } from '../common';
import { IStorageService } from '../../../platform/storage/storage';
import { debounce } from '../../../base/common/decorator';

export enum EPart {
  TitleBar = 'titleBar',
  ActivityBar = 'activityBar',
  LeftSideBar = 'sideBar',
  RightSideBar = 'rightSideBar',
  Editor = 'editor',
  Panel = 'panel',
  StatusBar = 'statusBar',
}

export interface IPart {
  id: EPart;
  isVisible: boolean;
  component?: React.FC;
}

export interface PartsSlice {
  parts: {
    [key in EPart]: IPart;
  };
  layout: {
    titleHeight: number;
    statusHeight: number;
    activityWidth: number;

    leftWidth: number;
    rightWidth: number;
    panelHeight: number;

    setLeftWidth: (w: number) => void;
    setRightWidth: (w: number) => void;
    setPanelHeight: (h: number) => void;
  };
}

const defaultLayout = {
  titleHeight: 32,
  statusHeight: 24,
  activityWidth: 48,
  leftWidth: 240,
  rightWidth: 300,
  panelHeight: 200,
};

export const createPartsSlice =
  ({ accessor }: IWorkbenchStoreOptions): StateCreator<PartsSlice> =>
  (set, get) => {
    const storage = accessor.get(IStorageService);
    const layout = storage.get('workbench', 'layout', defaultLayout);
    const saveLayout = debounce(() => {
      storage.set('workbench', 'layout', get().layout);
    }, 100);

    return {
      parts: {
        [EPart.TitleBar]: { id: EPart.TitleBar, isVisible: true },
        [EPart.ActivityBar]: { id: EPart.ActivityBar, isVisible: true },
        [EPart.LeftSideBar]: { id: EPart.LeftSideBar, isVisible: true },
        [EPart.RightSideBar]: { id: EPart.RightSideBar, isVisible: true },
        [EPart.Editor]: { id: EPart.Editor, isVisible: true },
        [EPart.Panel]: { id: EPart.Panel, isVisible: true },
        [EPart.StatusBar]: { id: EPart.StatusBar, isVisible: true },
      },
      layout: {
        ...layout,
        setLeftWidth: (w: number) =>
          set((state) => {
            saveLayout();
            return { layout: { ...state.layout, leftWidth: w } };
          }),
        setRightWidth: (w: number) =>
          set((state) => {
            saveLayout();
            return { layout: { ...state.layout, rightWidth: w } };
          }),
        setPanelHeight: (h: number) =>
          set((state) => {
            saveLayout();
            return { layout: { ...state.layout, panelHeight: h } };
          }),
      },
    };
  };
