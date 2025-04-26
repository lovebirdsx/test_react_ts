import { StateCreator } from 'zustand';
import { ServicesAccessor } from '../../../platform/instantion/common/instantion';

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
  (accessor: ServicesAccessor): StateCreator<SideBarSlice> =>
  (set) => ({
    sideBar: {
      icons: [],
      addIcon: (icon: SideBarIcon) =>
        set((state) => ({ sideBar: { ...state.sideBar, icons: [...state.sideBar.icons, icon] } })),
      removeIcon: (icon: SideBarIcon) =>
        set((state) => ({ sideBar: { ...state.sideBar, icons: state.sideBar.icons.filter((i) => i !== icon) } })),
    },
  });
