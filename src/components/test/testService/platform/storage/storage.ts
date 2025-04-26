import { createDecorator } from '../instantion/common/instantion';

export interface IStorageService {
  get<T>(section: string, key: string, defaultValue: T): T;
  set<T>(section: string, key: string, value: T): void;
}

export const IStorageService = createDecorator<IStorageService>('storage');
