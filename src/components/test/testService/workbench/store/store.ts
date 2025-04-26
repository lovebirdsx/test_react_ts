import { StateCreator } from 'zustand';
import { createSideBarSlice, SideBarSlice } from './slice/sideBar';
import { createTitleBarSlice, TitleBarSlice } from './slice/titleBar';
import { IWorkbenchStoreOptions } from './common';

export type WorkbenchStore = SideBarSlice & TitleBarSlice & { id: string };

let idCounter = 0;

export const workbenchStoreCreator =
  (options: IWorkbenchStoreOptions): StateCreator<WorkbenchStore> =>
  (set, get, api) => {
    return {
      id: (++idCounter).toString(),
      ...createSideBarSlice(options)(set, get, api),
      ...createTitleBarSlice(options)(set, get, api),
    };
  };
