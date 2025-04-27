import { EventEmitter } from '../../base/event';
import { registerSingleton } from '../instantion/common/extension';
import { IStorageService } from './storage';

class StorageService implements IStorageService {
  readonly _serviceBrand: undefined = undefined;

  private readonly _onDidChange = new EventEmitter<{ section: string; key: string; value: any }>();
  readonly onDidChange = this._onDidChange.event;

  private getKey(section: string, key: string): string {
    return `${section}.${key}`;
  }

  get<T>(section: string, key: string, defaultValue: T): T {
    const storageKey = this.getKey(section, key);
    const value = localStorage.getItem(storageKey);
    if (value === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing storage value for key "${storageKey}":`, error);
      return defaultValue;
    }
  }

  set<T>(section: string, key: string, value: T): void {
    const storageKey = this.getKey(section, key);
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(storageKey, serializedValue);
      console.log(`Storage value set for key "${storageKey}":`, serializedValue);
    } catch (error) {
      console.error(`Error setting storage value for key "${storageKey}":`, error);
    }

    this._onDidChange.fire({ section, key, value });
  }
}

registerSingleton(IStorageService, StorageService, true);
