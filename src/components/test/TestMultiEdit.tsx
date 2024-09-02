import { produce } from 'immer';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { AppContext } from '../../app/context';

export type ToInterface<T> = {
  [K in keyof T]: T[K];
};

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

interface EditorState {
  value: IEditorObject;
  selectedPaths: string[];
}

interface EditorActions {
  clearSelectedPaths: () => void;
  addSelectedPath: (path: string) => void;
  removeSelectedPath: (path: string) => void;
  setValue: (value: IEditorObject) => void;
  modifyValue: (path: string, value: any) => void;
}

const useEditorStore = create<EditorState & EditorActions>((set) => ({
  selectedPaths: [],
  value: objToInterface(new EditorObject()),
  setValue: (value) => set({ value }),
  clearSelectedPaths: () =>
    set((state) => {
      if (state.selectedPaths.length > 0) {
        return { selectedPaths: [] };
      }
      return state;
    }),
  addSelectedPath: (path) => set((state) => ({ selectedPaths: [...state.selectedPaths, path] })),
  removeSelectedPath: (path) => set((state) => ({ selectedPaths: state.selectedPaths.filter((p) => p !== path) })),
  modifyValue: (path, value) =>
    set((state) => {
      const newValue = produce(state.value, (draft) => {
        if (state.selectedPaths.includes(path)) {
          state.selectedPaths.forEach((p) => {
            setValueByPath(draft, p, value);
          });
        } else {
          setValueByPath(draft, path, value);
        }
      });
      return { value: newValue };
    }),
}));

interface IProps<T> {
  value: T;
  path: string;
  parent?: IProps<unknown>;
}

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

const SchemaRender = memo(
  <T extends Obj>(props: IProps<T>) => {
    const { value, parent } = props;
    const selectedPaths = useEditorStore((state) => state.selectedPaths);
    const clearSelectedPaths = useEditorStore((state) => state.clearSelectedPaths);
    const addSelectedPath = useEditorStore((state) => state.addSelectedPath);
    const removeSelectedPath = useEditorStore((state) => state.removeSelectedPath);
    const modifyValue = useEditorStore((state) => state.modifyValue);

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
                    addSelectedPath(path);
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
    return prev.value === next.value;
  },
);

function Editor() {
  const { value, selectedPaths, clearSelectedPaths } = useEditorStore();
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
      </div>
      <SchemaRender value={value} path="" />
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
