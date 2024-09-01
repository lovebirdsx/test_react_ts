import { produce } from 'immer';
import { createContext, memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../app/context';

export type ToInterface<T> = {
  [K in keyof T]: T[K];
};

class Obj {}

export function objToInterface<T extends Obj>(obj: T): ToInterface<T> {
  const keys = Object.keys(obj) as (keyof T)[];
  const newObj = {} as ToInterface<T>;
  keys.forEach((key) => {
    if (typeof obj[key] === 'object') {
      newObj[key] = objToInterface(obj[key] as Obj) as any;
    } else {
      newObj[key as keyof T] = obj[key];
    }
  });
  return newObj;
}

export function getValueByPath(obj: any, path: string): any {
  const paths = path.split('.');

  let value: any = obj;
  for (const p of paths) {
    value = value[p];
  }

  return value;
}

export function setValueByPath(obj: any, path: string, value: any): void {
  const paths = path.split('.');

  let target: any = obj;
  for (let i = 0; i < paths.length - 1; i++) {
    target = target[paths[i]];
  }

  target[paths[paths.length - 1]] = value;
}

interface IContext {
  selectedPaths: string[];
  clearSelectedPaths: () => void;
  addSelectedPath: (path: string, isCurrent: boolean) => void;
  removeSelectedPath: (path: string) => void;
  modifyValue: (path: string, value: any) => void;
}
const Context = createContext<IContext>(undefined!);

interface IProps<T> {
  value: T;
  path: string;
  parent?: IProps<unknown>;
}

class BaseInfoComponent {
  catogory = 'unknown';
}

class StateComponent {
  state = 1;
}

class Components {
  baseInfo = new BaseInfoComponent();
  state = new StateComponent();
}

class EditorObject {
  name = 'unknown';
  components = new Components();
}

type IEditorObject = ToInterface<EditorObject>;

function isString(value: any): value is string {
  return typeof value === 'string';
}

function isObject(value: any): value is Obj {
  return typeof value === 'object';
}

type InputProps = React.ComponentProps<'input'>;
export function Input(props: InputProps) {
  const { value, ...rest } = props;
  const [selfValue, setSelfValue] = useState(props.value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = ref.current;
    if (!input) {
      return;
    }

    if (value !== selfValue) {
      setSelfValue(value);
      input.value = value as string;
    }
  }, [selfValue, value]);

  return <input ref={ref} defaultValue={value} {...rest} />;
}

// 获得时间，形式为：小时:分钟:秒
function now() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

const config = {
  useDeepEqual: true,
};

function getConfig(key: keyof typeof config) {
  return config[key];
}

function setConfig<T extends keyof typeof config>(key: T, value: (typeof config)[T]) {
  config[key] = value;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

const SchemaRender = memo(
  <T extends Obj>(props: IProps<T>) => {
    const { value, parent } = props;
    const context = useContext(Context);
    const { selectedPaths, clearSelectedPaths, addSelectedPath, removeSelectedPath, modifyValue } = context;

    const keys = Object.keys(value).filter((key) => isString(key));
    console.log(now(), 'SchemaRender for', props.path);

    return (
      <div>
        {keys.map((key) => {
          const path = parent ? `${props.path}.${key}` : key;
          const isSelected = selectedPaths.includes(path);
          const filedValue = value[key as keyof T];

          if (!isObject(filedValue)) {
            return (
              <div
                key={key}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    clearSelectedPaths();
                    e.stopPropagation();
                  }
                }}
                onClick={(e) => {
                  if (!e.altKey) {
                    e.stopPropagation();
                    return;
                  }

                  if (isSelected) {
                    removeSelectedPath(path);
                  } else {
                    addSelectedPath(path, true);
                  }
                }}
                style={{ backgroundColor: isSelected ? '#e0e0e0' : 'white', marginLeft: props.path ? 20 : 0 }}
              >
                {key}: <Input value={filedValue as string} onChange={(e) => modifyValue(path, e.target.value)} />
              </div>
            );
          }

          return (
            <div key={key} style={{ marginLeft: props.path ? 20 : 0 }}>
              {key} :<SchemaRender key={key} value={filedValue} path={path} parent={props} />
            </div>
          );
        })}
      </div>
    );
  },
  (prev, next) => {
    const result = getConfig('useDeepEqual') ? deepEqual(prev.value, next.value) : prev.value === next.value;
    console.log(now(), 'compare', prev.path, result);
    return result;
  },
);

function Editor() {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [, setState] = useState(1);

  const clearSelectedPaths = useCallback(() => {
    if (selectedPaths.length === 0) {
      return;
    }

    setSelectedPaths([]);
  }, [selectedPaths]);

  const addSelectedPath = useCallback(
    (path: string) => {
      setSelectedPaths([...selectedPaths, path]);
    },
    [selectedPaths],
  );

  const removeSelectedPath = useCallback((path: string) => {
    setSelectedPaths((prev) => {
      return prev.filter((p) => p !== path);
    });
  }, []);

  const [value, setValue] = useState<IEditorObject>(objToInterface(new EditorObject()));
  const modifyValue = useCallback(
    (path: string, value: any) => {
      setValue((prev) => {
        const newValue = produce(prev, (draft) => {
          if (selectedPaths.includes(path)) {
            selectedPaths.forEach((p) => {
              setValueByPath(draft, p, value);
            });
          } else {
            setValueByPath(draft, path, value);
          }
        });
        return newValue;
      });
    },
    [selectedPaths],
  );

  return (
    <div
      onClick={(e) => {
        if (!e.altKey) {
          clearSelectedPaths();
        }
      }}
    >
      <div>
        <div>selectedPaths: {selectedPaths.join(', ')}</div>
        <div>
          useDeepEqual
          <input
            type="checkbox"
            checked={getConfig('useDeepEqual')}
            onChange={(e) => {
              setConfig('useDeepEqual', e.target.checked);
              setState((prev) => prev + 1);
            }}
          />
        </div>
      </div>
      <Context.Provider value={{ selectedPaths, clearSelectedPaths, removeSelectedPath, addSelectedPath, modifyValue }}>
        <SchemaRender value={value} path="" />
      </Context.Provider>
    </div>
  );
}

function SchemaBasedMultiEditor() {
  const appContext = useContext(AppContext);
  return (
    <div>
      <div>
        useStrictMode
        <input
          type="checkbox"
          checked={appContext.config.useStrictMode}
          onChange={(e) => appContext.setConfig('useStrictMode', e.target.checked)}
        />
      </div>
      <Editor />
    </div>
  );
}

export function TestMultiEdit() {
  return (
    <div>
      <h2>基于Schema的多选编辑</h2>
      <SchemaBasedMultiEditor />
    </div>
  );
}
