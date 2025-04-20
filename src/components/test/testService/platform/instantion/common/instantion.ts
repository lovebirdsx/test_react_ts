import { ServiceIdentifier } from './serviceCollection';

export interface ServicesAccessor {
  get<T>(id: ServiceIdentifier<T>): T;
}

export const serviceIds = new Map<string, ServiceIdentifier<any>>();

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
  if (serviceIds.has(serviceId)) {
    return serviceIds.get(serviceId)!;
  }

  const id = function id(target: any, _key: string, index: number): any {
    if (arguments.length !== 3) {
      throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
    }
  } as any;

  id.toString = () => serviceId;

  serviceIds.set(serviceId, id);
  return id;
}

export interface IInstantiationService {
  readonly _serviceBrand: undefined;

  invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');
