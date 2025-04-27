import { ServiceIdentifier } from './serviceCollection';
import { SyncDescriptor } from './descriptors';

const registry: [ServiceIdentifier<any>, SyncDescriptor<any>][] = [];
export function registerSingleton<T>(
  id: ServiceIdentifier<T>,
  ctor: { new (...args: any[]): T },
  supportsDelayedInstantiation: boolean,
): void {
  registry.push([id, new SyncDescriptor(ctor, [], supportsDelayedInstantiation)]);
}

export function getSingletonServiceDescriptors(): [ServiceIdentifier<any>, SyncDescriptor<any>][] {
  return registry;
}
