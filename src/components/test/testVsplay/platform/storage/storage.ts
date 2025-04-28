import { IEvent } from '../../base/common/event';
import { createDecorator } from '../instantion/common/instantion';

export interface IStorageService {
  readonly _serviceBrand: undefined;
  onDidChange: IEvent<{ section: string; key: string; value: any }>;
  get<T>(section: string, key: string, defaultValue: T): T;
  set<T>(section: string, key: string, value: T): void;
}

export const IStorageService = createDecorator<IStorageService>('storage');
