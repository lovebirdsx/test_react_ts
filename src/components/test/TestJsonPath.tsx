import { create, StateCreator } from 'zustand';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import * as React from 'react';

type Event<T> = (listener: (e: T) => any) => () => void;

class Emitter<T> {
  private listeners: Array<(e: T) => any> = [];

  event: Event<T> = (listener: (e: T) => any) => {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  };

  fire(eventData: T): void {
    for (const listener of this.listeners) {
      listener(eventData);
    }
  }
}

export function jsonPathToString(jsonPath: string[]): string {
  return jsonPath.join('.');
}

export function stringToJsonPath(str: string): string[] {
  if (!str) {
    return [];
  }

  return str.split('.');
}

export function getValueByJsonPath(obj: any, jsonPath: string[]): any {
  let value: any = obj;
  for (const p of jsonPath) {
    value = value[p];
  }

  return value;
}

export function setValueByJsonPath(obj: any, jsonPath: string[], value: any): void {
  if (jsonPath.length === 0) {
    Object.keys(obj).forEach((key) => delete obj[key]);
    Object.assign(obj, value);
    return;
  }

  let target: any = obj;
  for (let i = 0; i < jsonPath.length - 1; i++) {
    target = target[jsonPath[i]];
  }

  target[jsonPath[jsonPath.length - 1]] = value;
}

export function addFieldToJsonPathString(jsonPath: string, field: string): string {
  if (!jsonPath) {
    return field;
  }

  return `${jsonPath}.${field}`;
}

export interface ObjectSlice {
  object: {
    data: unknown;

    setByJsonPath(jsonPathStr: string, data: unknown): void;
    getByJsonPath(jsonPathStr: string): unknown;
    onSetByJsonPath: Event<{ jsonPathStr: string; data: unknown }>;
  };
}

export const createObjectSlice: StateCreator<ObjectSlice> = (setApi, getApi) => {
  const onSetByJsonPathEmmiter = new Emitter<{ jsonPathStr: string; data: unknown }>();

  const setByJsonPath = (jsonPathStr: string, data: unknown) => {
    setApi((state) => {
      const nextState = produce(state, (draft) => {
        const jsonPath = stringToJsonPath(jsonPathStr);
        setValueByJsonPath(draft.object.data, jsonPath, data);
      });

      onSetByJsonPathEmmiter.fire({ jsonPathStr, data });
      return nextState;
    });
  };

  const getByJsonPath = (jsonPathStr: string) => {
    const jsonPath = stringToJsonPath(jsonPathStr);
    return getValueByJsonPath(getApi().object.data, jsonPath);
  };

  const onSetByJsonPath = onSetByJsonPathEmmiter.event;

  return {
    object: {
      data: {
        foo: {
          id: '123',
          name: 'baz',
        },
        bar: 1,
      },

      setByJsonPath,
      getByJsonPath,
      onSetByJsonPath,
    },
  };
};

export const useEditorStore = create<ObjectSlice>((set, get, api) => {
  const initialState = {
    ...createObjectSlice(set, get, api),
  };

  return initialState;
});

interface DataNodeProps {
  jsonPathString: string;
}

const DataNode: React.FC<DataNodeProps> = ({ jsonPathString }) => {
  const getByJsonValue = useEditorStore((state) => state.object.getByJsonPath);
  const setByJsonValue = useEditorStore((state) => state.object.setByJsonPath);
  const onSetByJsonPath = useEditorStore((state) => state.object.onSetByJsonPath);

  const [myValue, setMyValue] = useState(getByJsonValue(jsonPathString));

  useEffect(() => {
    return onSetByJsonPath((e) => {
      if (e.jsonPathStr === jsonPathString) {
        setMyValue(e.data as object);
      }
    });
  }, [jsonPathString, onSetByJsonPath]);

  if (typeof myValue === 'string') {
    return (
      <input
        value={myValue}
        onChange={(e) => {
          setByJsonValue(jsonPathString, e.target.value);
        }}
      />
    );
  }

  if (myValue === undefined || myValue === null) {
    return <div>undefined</div>;
  }

  if (typeof myValue === 'object') {
    return (
      <div>
        {Object.keys(myValue).map((key) => (
          <div style={{ marginLeft: jsonPathString ? 20 : 0 }} key={key}>
            <span style={{ minWidth: 100, display: 'inline-block' }}>{key}</span>
            <DataNode jsonPathString={addFieldToJsonPathString(jsonPathString, key)} />
          </div>
        ))}
      </div>
    );
  }

  return <div>{JSON.stringify(myValue)}</div>;
};

const OriginJsonString: React.FC = () => {
  const data = useEditorStore((state) => state.object.data);
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const TestJsonPath: React.FC = () => {
  return (
    <div>
      <div>
        <h3>Origin Json String</h3>
      </div>
      <OriginJsonString />
      <div>
        <h3>Editor</h3>
      </div>
      <DataNode jsonPathString="" />
    </div>
  );
};
