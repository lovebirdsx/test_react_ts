import { Workbench } from './workbench/Workbench';
import { ServiceProvider } from './workbench/context/service';
import { WorkbenchStoreProvider } from './workbench/context/store';

export function TestService() {
  return (
    <ServiceProvider>
      <WorkbenchStoreProvider>
        <Workbench />
      </WorkbenchStoreProvider>
    </ServiceProvider>
  );
}
