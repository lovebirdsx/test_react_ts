import { SyncDescriptor } from './descriptors';
import { IInstantiationService, ServicesAccessor } from './instantion';
import { ServiceCollection, ServiceIdentifier } from './serviceCollection';

export class InstantiationService implements IInstantiationService {
  declare readonly _serviceBrand: undefined;

  constructor(private readonly services: ServiceCollection) {}

  invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
    const accessor: ServicesAccessor = {
      get: <T>(id: ServiceIdentifier<T>): T => {
        const service = this.services.get(id);
        if (!service) {
          throw new Error(`Service not found: ${id.toString()}`);
        }

        if (service instanceof SyncDescriptor) {
          // eslint-disable-next-line new-cap
          const instance = new service.ctor([]);
          this.services.set(id, instance);
          return instance;
        }

        return service;
      },
    };

    return fn(accessor, ...args);
  }
}
