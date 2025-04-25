import '../platform/file/node/file';

import { getSingletonServiceDescriptors } from '../platform/instantion/common/extension';
import { ServiceCollection } from '../platform/instantion/common/serviceCollection';
import { WorkbenchMain } from '../workbench/main';

export class VsplayMain {
  startup() {
    const services = new ServiceCollection();
    for (const [id, descriptor] of getSingletonServiceDescriptors()) {
      services.set(id, descriptor);
    }

    const workbench = new WorkbenchMain(services);
    workbench.startup();
  }
}
