import '../platform/file/node/file';

import { ServiceCollection } from '../platform/instantion/common/serviceCollection';
import { IInstantiationService, ServicesAccessor } from '../platform/instantion/common/instantion';
import { InstantiationService } from '../platform/instantion/common/instantiationService';
import { getSingletonServiceDescriptors } from '../platform/instantion/common/extension';

export class WorkbenchMain {
  private readonly serviceCollection: ServiceCollection = new ServiceCollection();
  private readonly _getServiceAccessorPromise: Promise<ServicesAccessor>;

  constructor() {
    for (const [id, descriptor] of getSingletonServiceDescriptors()) {
      this.serviceCollection.set(id, descriptor);
    }

    const instantiationService = new InstantiationService(this.serviceCollection);
    this.serviceCollection.set(IInstantiationService, instantiationService);
    this._getServiceAccessorPromise = new Promise<ServicesAccessor>((resolve) => {
      const instantiationService = this.serviceCollection.get(IInstantiationService) as InstantiationService;
      instantiationService.invokeFunction((accessor) => {
        resolve(accessor);
      });
    });
  }

  async getServicesAccessor() {
    return this._getServiceAccessorPromise;
  }
}
