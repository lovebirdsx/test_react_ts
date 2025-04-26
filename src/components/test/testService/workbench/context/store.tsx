import { createStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { createContext, useContext, useRef } from 'react';
import { WorkbenchStore, workbenchStoreCreator } from '../store/store';
import { ServicesAccessor } from '../../platform/instantion/common/instantion';
import { useServiceContext } from './service';

export const createWorkbenchStore = (accessor: ServicesAccessor) => {
  return createStore<WorkbenchStore>(workbenchStoreCreator(accessor));
};

export type WorkbenchStoreApi = ReturnType<typeof createWorkbenchStore>;

export const WorkbenchStoreContext = createContext<WorkbenchStoreApi>(undefined!);

export function WorkbenchStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<WorkbenchStoreApi | undefined>(undefined);
  const accessor = useServiceContext();
  if (!storeRef.current) {
    storeRef.current = createWorkbenchStore(accessor);
  }

  return <WorkbenchStoreContext.Provider value={storeRef.current}>{children}</WorkbenchStoreContext.Provider>;
}

export type UseWorkbenchStoreContextSelector<T> = (state: WorkbenchStore) => T;

export function useWorkbenchStore<T>(selector: UseWorkbenchStoreContextSelector<T>): T {
  const context = useContext(WorkbenchStoreContext);
  if (!context) {
    throw new Error('useWorkbenchStore must be used within a WorkbenchStoreProvider');
  }

  return useStoreWithEqualityFn(context, selector, shallow);
}
