import { DisposableStore } from '../../base/event';
import { ServicesAccessor } from '../../platform/instantion/common/instantion';

export interface IWorkbenchStoreOptions {
  disposableStore: DisposableStore;
  accessor: ServicesAccessor;
}
