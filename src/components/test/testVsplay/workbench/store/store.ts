import { StateCreator } from 'zustand';
import { IWorkbenchStoreOptions } from './common';
import { createSideBarSlice, SideBarSlice } from './slice/sideBar';
import { createTitleBarSlice, TitleBarSlice } from './slice/titleBar';
import { createPartsSlice, PartsSlice } from './slice/parts';

export type WorkbenchStore = SideBarSlice & TitleBarSlice & PartsSlice & { id: string };

let idCounter = 0;

export const workbenchStoreCreator =
  (options: IWorkbenchStoreOptions): StateCreator<WorkbenchStore> =>
  (set, get, api) => {
    return {
      id: (++idCounter).toString(),
      ...createPartsSlice(options)(set, get, api),
      ...createSideBarSlice(options)(set, get, api),
      ...createTitleBarSlice(options)(set, get, api),
    };
  };
