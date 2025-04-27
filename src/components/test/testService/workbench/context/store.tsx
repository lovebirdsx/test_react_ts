import { createStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { createContext, useContext, useEffect, useRef, useState } from 'react'; // Import useState
import { WorkbenchStore, workbenchStoreCreator } from '../store/store';
import { IWorkbenchStoreOptions } from '../store/common';
import { DisposableStore } from '../../base/event';
import { useService } from './service';

export const createWorkbenchStore = (options: IWorkbenchStoreOptions) => {
  return createStore<WorkbenchStore>(workbenchStoreCreator(options));
};

export type WorkbenchStoreApi = ReturnType<typeof createWorkbenchStore>;

const WorkbenchStoreContext = createContext<WorkbenchStoreApi>(undefined!);

export function WorkbenchStoreProvider({ children }: { children: React.ReactNode }) {
  const accessor = useService();
  const storeRef = useRef<WorkbenchStoreApi | null>(null);
  const [store, setStore] = useState<WorkbenchStoreApi>();

  // 在strict模式下，useEffect会多执行一次，所以要确保资源创建和销毁的一致性
  // 具体参考：https://legacy.reactjs.org/docs/strict-mode.html
  useEffect(() => {
    const disposable = new DisposableStore();
    const store = createWorkbenchStore({ accessor, disposableStore: disposable });
    storeRef.current = store;
    setStore(store);

    return () => {
      disposable.dispose();
      storeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!store) {
    return <div>Loading...</div>;
  }

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
