import { DisposableStore } from '../../base/common/event';
import { ServicesAccessor } from '../../platform/instantion/common/instantion';

export interface IWorkbenchStoreOptions {
  disposableStore: DisposableStore;
  accessor: ServicesAccessor;
}
