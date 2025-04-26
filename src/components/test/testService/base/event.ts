export interface IDisposable {
  dispose(): void;
}

export interface IEvent<T> {
  (listener: (e: T) => void, thisArg?: any, disposables?: IDisposable[]): IDisposable;
}

type ListenerData<T, A> = {
  listener: (this: A, e: T) => void;
  thisArg?: A;
};

export class EventEmitter<T> implements IDisposable {
  public event: IEvent<T>;

  private _deliveryQueue?: { data: ListenerData<T, any>; event: T }[];

  private _listeners = new Set<ListenerData<T, any>>();

  public get size() {
    return this._listeners.size;
  }

  constructor() {
    this.event = <ThisArg>(listener: (this: ThisArg, e: T) => void, thisArg?: ThisArg, disposables?: IDisposable[]) => {
      const data: ListenerData<T, ThisArg> = { listener, thisArg };
      this._listeners.add(data);
      const result = {
        dispose: () => {
          result.dispose = () => {
            /* no-op */
          };
          this._listeners.delete(data);
        },
      };
      if (disposables) disposables.push(result);
      return result;
    };
  }

  fire(event: T): void {
    const dispatch = !this._deliveryQueue;
    if (!this._deliveryQueue) this._deliveryQueue = [];
    for (const data of this._listeners) this._deliveryQueue.push({ data, event });
    if (!dispatch) return;
    for (let index = 0; index < this._deliveryQueue.length; index++) {
      const { data, event } = this._deliveryQueue[index];
      data.listener.call(data.thisArg, event);
    }
    this._deliveryQueue = undefined;
  }

  dispose() {
    this._listeners.clear();
    if (this._deliveryQueue) this._deliveryQueue = [];
  }
}

export class DisposableStore implements IDisposable {
  private _toDispose: IDisposable[] = [];

  add<T extends IDisposable>(t: T): T {
    this._toDispose.push(t);
    return t;
  }

  dispose() {
    for (const disposable of this._toDispose) {
      disposable.dispose();
    }

    this._toDispose = [];
  }
}
