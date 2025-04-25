import React from 'react';
import '../platform/file/node/file';

import { ServiceCollection } from '../platform/instantion/common/serviceCollection';
import { Workbench } from './Workbench';

export class WorkbenchMain {
  constructor(private readonly serviceCollection: ServiceCollection) {}

  startup() {}

  render() {
    return React.createElement(Workbench);
  }
}
