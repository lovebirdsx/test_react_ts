import { StateCreator } from 'zustand';
import { createSideBarSlice, SideBarSlice } from './slice/sideBar';
import { createTitleBarSlice, TitleBarSlice } from './slice/titleBar';
import { ServicesAccessor } from '../../platform/instantion/common/instantion';

export type WorkbenchStore = SideBarSlice & TitleBarSlice;

export const workbenchStoreCreator =
  (accessor: ServicesAccessor): StateCreator<WorkbenchStore> =>
  (set, get, api) => ({
    ...createSideBarSlice(accessor)(set, get, api),
    ...createTitleBarSlice(accessor)(set, get, api),
  });
