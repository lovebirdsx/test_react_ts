import { createStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { createContext, useContext, useEffect, useState } from 'react'; // Import useState
import { WorkbenchStore, workbenchStoreCreator } from '../store/store';
import { IWorkbenchStoreOptions } from '../store/common';
import { DisposableStore } from '../../base/event';
import { useService } from './service';

export const createWorkbenchStore = (options: IWorkbenchStoreOptions) => {
  return createStore<WorkbenchStore>(workbenchStoreCreator(options));
};

export type WorkbenchStoreApi = ReturnType<typeof createWorkbenchStore>;

let workbenchStore: WorkbenchStoreApi | undefined;
function getWorkbenchStore(options: IWorkbenchStoreOptions) {
  if (!workbenchStore) {
    workbenchStore = createWorkbenchStore(options);
  }
  return workbenchStore;
}

const WorkbenchStoreContext = createContext<WorkbenchStoreApi>(undefined!);

export function WorkbenchStoreProvider({ children }: { children: React.ReactNode }) {
  const accessor = useService();

  // 只在初次渲染时执行一次
  const [{ store, disposable }] = useState(() => {
    const disposable = new DisposableStore();
    const store = createWorkbenchStore({ accessor, disposableStore: disposable });
    console.log('create store', store.getState().id);
    return { store, disposable };
  });

  // 只在卸载时清理一次
  useEffect(() => {
    console.log('use effect', store.getState().id);
    return () => {
      disposable.dispose();
      console.log('dispose store', store.getState().id);
    };
  }, [disposable, store]);

  return <WorkbenchStoreContext.Provider value={store}>{children}</WorkbenchStoreContext.Provider>;
}

export type UseWorkbenchStoreContextSelector<T> = (state: WorkbenchStore) => T;

export function useWorkbenchStore<T>(selector: UseWorkbenchStoreContextSelector<T>): T {
  const store = useContext(WorkbenchStoreContext);
  if (!store) {
    throw new Error('useWorkbenchStore must be used within a WorkbenchStoreProvider');
  }

  return useStoreWithEqualityFn(store, selector, shallow);
}
