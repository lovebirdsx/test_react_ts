import { Workbench } from './workbench/Workbench';
import { ServiceProvider } from './workbench/serviceContext';

export function TestService() {
  return (
    <ServiceProvider>
      <Workbench />
    </ServiceProvider>
  );
}
