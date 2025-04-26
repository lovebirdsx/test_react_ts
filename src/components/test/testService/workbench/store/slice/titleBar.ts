import { StateCreator } from 'zustand';
import { ServicesAccessor } from '../../../platform/instantion/common/instantion';
import { IStorageService } from '../../../platform/storage/storage';

export interface TitleBarSlice {
  titleBar: {
    title: string;
    setTitle: (title: string) => void;
  };
}

export const createTitleBarSlice = (accessor: ServicesAccessor): StateCreator<TitleBarSlice> => {
  const storageService = accessor.get(IStorageService);
  const title = storageService.get<string>('workbench', 'title', 'Default Title');
  return (set) => ({
    titleBar: {
      title,
      setTitle: (title: string) => {
        set((state) => ({ titleBar: { ...state.titleBar, title } }));
        storageService.set('workbench', 'title', title);
      },
    },
  });
};
