import { StateCreator } from 'zustand';
import { IStorageService } from '../../../platform/storage/storage';
import { IWorkbenchStoreOptions } from '../common';

export interface TitleBarSlice {
  titleBar: {
    title: string;
    setTitle: (title: string) => void;
  };
}

export const createTitleBarSlice = ({
  accessor,
  disposableStore,
}: IWorkbenchStoreOptions): StateCreator<TitleBarSlice> => {
  const storageService = accessor.get(IStorageService);
  const title = storageService.get<string>('workbench', 'title', 'Default Title');
  return (set, get) => {
    disposableStore.add(
      storageService.onDidChange(({ section, key, value }) => {
        if (section === 'workbench' && key === 'title' && value !== get().titleBar.title) {
          set((state) => ({ titleBar: { ...state.titleBar, title: value } }));
        }
      }),
    );

    return {
      titleBar: {
        title,
        setTitle: (title: string) => {
          set((state) => ({ titleBar: { ...state.titleBar, title } }));
          storageService.set('workbench', 'title', title);
        },
      },
    };
  };
};
