import { StateCreator } from 'zustand';
import { IWorkbenchStoreOptions } from '../common';

export interface SideBarIcon {
  icon: string;
  title: string;
  element: React.ReactNode;
}

export interface SideBarSlice {
  sideBar: {
    icons: SideBarIcon[];
    addIcon: (icon: SideBarIcon) => void;
    removeIcon: (icon: SideBarIcon) => void;
  };
}

export const createSideBarSlice =
  ({ accessor }: IWorkbenchStoreOptions): StateCreator<SideBarSlice> =>
  (set) => ({
    sideBar: {
      icons: [],
      addIcon: (icon: SideBarIcon) =>
        set((state) => ({ sideBar: { ...state.sideBar, icons: [...state.sideBar.icons, icon] } })),
      removeIcon: (icon: SideBarIcon) =>
        set((state) => ({ sideBar: { ...state.sideBar, icons: state.sideBar.icons.filter((i) => i !== icon) } })),
    },
  });
