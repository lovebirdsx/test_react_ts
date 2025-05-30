import React, { useEffect } from 'react';
import { ServicesAccessor } from '../../platform/instantion/common/instantion';
import { WorkbenchMain } from '../main';

const serviceContext = React.createContext<ServicesAccessor>(undefined!);
const workbenchMain = new WorkbenchMain();

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [accessor, setAccessor] = React.useState<ServicesAccessor | undefined>(undefined);

  useEffect(() => {
    if (!accessor)
      workbenchMain.getServicesAccessor().then((accessor) => {
        setAccessor(accessor);
      });
  }, [accessor]);

  if (!accessor) {
    return <div>Loading...</div>;
  }

  return <serviceContext.Provider value={accessor}>{children}</serviceContext.Provider>;
}

export function useService() {
  const context = React.useContext(serviceContext);
  if (!context) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
}
