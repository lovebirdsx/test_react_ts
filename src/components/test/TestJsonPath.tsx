import { create, StateCreator } from 'zustand';
import { produce } from 'immer';
import React from 'react';

// Utility functions for JSON path manipulation
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
  return jsonPath.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function setValueByJsonPath(obj: any, jsonPath: string[], value: any): void {
  if (jsonPath.length === 0) {
    Object.keys(obj).forEach((key) => delete obj[key]);
    Object.assign(obj, value);
    return;
  }

  let target: any = obj;
  for (let i = 0; i < jsonPath.length - 1; i++) {
    if (!target[jsonPath[i]]) {
      target[jsonPath[i]] = {};
    }
    target = target[jsonPath[i]];
  }

  target[jsonPath[jsonPath.length - 1]] = value;
}

export function addFieldToJsonPathString(jsonPath: string, field: string): string {
  return jsonPath ? `${jsonPath}.${field}` : field;
}

interface IMeta {
  type: 'object' | 'string' | 'number' | 'boolean' | 'undefined' | 'bigint' | 'symbol' | 'function';
  fields?: string[];
}

// Define the shape of the state slice
export interface ObjectSlice {
  object: {
    data: Record<string, any>;
    valueByJsonPath: Record<string, any>;
    metaByJsonPath: Record<string, IMeta>;

    /**
     * 设定data中的某个字段的值
     * @param jsonPathStr 字段的json path
     * @param data 新的值
     */
    setByJsonPath: (jsonPathStr: string, data: any) => void;
  };
}

function createValueAndMetaByJsonPath(data: Record<string, any>): {
  valueByJsonPath: Record<string, any>;
  metaByJsonPath: Record<string, IMeta>;
} {
  const valueByJsonPath: Record<string, any> = {};
  const metaByJsonPath: Record<string, IMeta> = {};

  function createValueByJsonPathRecursive(obj: any, jsonPath: string[]) {
    if (typeof obj !== 'object') {
      return;
    }

    const objJsonPathStr = jsonPathToString(jsonPath);
    if (obj === null) {
      metaByJsonPath[objJsonPathStr] = {
        type: 'object',
        fields: [],
      };
      return;
    }

    metaByJsonPath[objJsonPathStr] = {
      type: 'object',
      fields: Object.keys(obj),
    };

    Object.keys(obj).forEach((key) => {
      const jsonPathStr = jsonPathToString([...jsonPath, key]);
      const fieldVal = obj[key];
      if (typeof fieldVal === 'object') {
        createValueByJsonPathRecursive(fieldVal, [...jsonPath, key]);
      } else {
        valueByJsonPath[jsonPathStr] = fieldVal;
        metaByJsonPath[jsonPathStr] = {
          type: typeof fieldVal,
        };
      }
    });
  }

  createValueByJsonPathRecursive(data, []);

  return { valueByJsonPath, metaByJsonPath };
}

// Create the object slice with Zustand and Immer
export const createObjectSlice: StateCreator<ObjectSlice> = (set, get) => {
  const data = {
    foo: {
      id: '123',
      name: 'baz',
    },
    bar: 1,
  };

  return {
    object: {
      data,
      ...createValueAndMetaByJsonPath(data),
      setByJsonPath: (jsonPathStr, newData) =>
        set(
          produce((state: ObjectSlice) => {
            const jsonPath = stringToJsonPath(jsonPathStr);
            setValueByJsonPath(state.object.data, jsonPath, newData);

            // Function to update valueByJsonPath and metaByJsonPath for a subtree
            function updateValueAndMeta(subData: unknown, subPath: string[]) {
              if (typeof subData !== 'object' || subData === null) {
                const fullPath = jsonPathToString(subPath);
                state.object.valueByJsonPath[fullPath] = subData;
                return;
              }

              const { valueByJsonPath, metaByJsonPath } = createValueAndMetaByJsonPath(subData);
              const prefix = jsonPathToString(subPath);

              Object.entries(valueByJsonPath).forEach(([key, value]) => {
                const fullPath = prefix ? `${prefix}.${key}` : key;
                state.object.valueByJsonPath[fullPath] = value;
              });

              Object.entries(metaByJsonPath).forEach(([key, meta]) => {
                const fullPath = prefix ? `${prefix}.${key}` : key;
                state.object.metaByJsonPath[fullPath] = meta;
              });
            }

            updateValueAndMeta(newData, jsonPath);
          }),
        ),
    },
  };
};

// Create the Zustand store
export const useEditorStore = create<ObjectSlice>((set, get, api) => ({
  ...createObjectSlice(set, get, api),
}));

// Props for the DataNode component
interface DataNodeProps {
  jsonPathString: string;
}

const String: React.FC<{ jsonPathString: string }> = ({ jsonPathString }) => {
  const myValue = useEditorStore((state) => state.object.valueByJsonPath[jsonPathString]);
  const setByJsonPath = useEditorStore((state) => state.object.setByJsonPath);

  return (
    <input
      value={myValue}
      onChange={(e) => {
        setByJsonPath(jsonPathString, e.target.value);
      }}
    />
  );
};

const Unkown: React.FC<{ jsonPathString: string }> = ({ jsonPathString }) => {
  const myValue = useEditorStore((state) => state.object.valueByJsonPath[jsonPathString]);
  return <div>{JSON.stringify(myValue)}</div>;
};

// DataNode component optimized with selectors
const DataNode: React.FC<DataNodeProps> = React.memo(({ jsonPathString }) => {
  const meta = useEditorStore((state) => state.object.metaByJsonPath[jsonPathString]);

  if (meta.type === 'string') {
    return <String jsonPathString={jsonPathString} />;
  }

  if (meta.type === 'undefined') {
    return <div>undefined</div>;
  }

  if (meta.type === 'object') {
    return (
      <div>
        {meta.fields!.map((key) => (
          <div key={key} style={{ marginLeft: jsonPathString ? 20 : 0 }}>
            <span style={{ minWidth: 100, display: 'inline-block' }}>{key}:</span>
            <DataNode jsonPathString={addFieldToJsonPathString(jsonPathString, key)} />
          </div>
        ))}
      </div>
    );
  }

  return <Unkown jsonPathString={jsonPathString} />;
});

// Component to display the original JSON string
const OriginJsonString: React.FC = React.memo(() => {
  const data = useEditorStore((state) => state.object.data);
  return (
    <pre
      style={{
        background: '#f0f0f0',
        padding: '10px',
        borderRadius: '4px',
        overflowX: 'auto',
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
});

// Main component combining OriginJsonString and DataNode
export const TestJsonPath: React.FC = () => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: 1 }}>
      <h3>Origin JSON String</h3>
      <OriginJsonString />
    </div>
    <div style={{ flex: 1 }}>
      <h3>Editor</h3>
      <DataNode jsonPathString="" />
    </div>
  </div>
);
