import '../platform/file/node/file';

import { getSingletonServiceDescriptors } from '../platform/instantion/common/extension';
import { InstantiationService } from '../platform/instantion/common/instantiationService';
import { ServiceCollection } from '../platform/instantion/common/serviceCollection';
import { Workbench } from './Workbench';

export async function main() {
  const services = new ServiceCollection();
  for (const [id, descriptor] of getSingletonServiceDescriptors()) {
    services.set(id, descriptor);
  }

  const instantiationService = new InstantiationService(services);
  return new Promise((resolve) => {
    instantiationService.invokeFunction(async (accessor) => {
      resolve(<Workbench accessor={accessor} />);
    });
  });
}
