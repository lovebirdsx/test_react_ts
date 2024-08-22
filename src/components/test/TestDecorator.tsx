// #region Types
type ToInterface<T> = {
  [K in keyof T]: T[K];
};

class Obj {}

// 将class的实例对象转换成object对象
function objToInterface<T extends Obj>(obj: T): ToInterface<T> {
  const keys = Object.keys(obj) as (keyof T)[];
  const newObj = {} as ToInterface<T>;
  keys.forEach((key) => {
    newObj[key as keyof T] = obj[key];
  });
  return newObj;
}

// #endregion

// #region Decorator

abstract class Attribute {}

const ATTRIBUTE_FIELD = '__ATTRIBUTE_FIELD';
function addAttribute<T extends Obj>(target: T, propertyKey: string, value: Attribute) {
  const key = `${ATTRIBUTE_FIELD}_${propertyKey}`;
  let attributes = (target as any)[key];
  if (!attributes) {
    attributes = [];
    (target as any)[key] = attributes;
  }

  attributes.push(value);
}

function getAttributes<T extends Obj, TAttr extends Attribute>(
  target: T,
  propertyKey: string,
  type: new () => TAttr,
): TAttr[] {
  const key = `${ATTRIBUTE_FIELD}_${propertyKey}`;
  const all = (target as any)[key] || [];
  return all.filter((e: Attribute) => e instanceof type) as TAttr[];
}

abstract class ExtraDrawAttribute extends Attribute {
  abstract render(): JSX.Element;
}

class PrefixAttribute extends ExtraDrawAttribute {
  prefix = '';

  render(): JSX.Element {
    return <div>{this.prefix}</div>;
  }
}

function prefix(prefix: string) {
  return (target: any, propertyKey: string) => {
    const attr = new PrefixAttribute();
    attr.prefix = prefix;
    addAttribute(target, propertyKey, attr);
  };
}

// #endregion

// #region Component

function ObjectComponent<T extends Obj>({ value, classObj }: { value: ToInterface<T>; classObj: new () => T }) {
  const keys = Object.keys(value) as (keyof T)[];
  return (
    <div>
      {keys.map((key) => {
        const v = value[key];
        const attributes = getAttributes(classObj.prototype, key as string, PrefixAttribute);

        return (
          <div key={key as string}>
            {attributes.length > 0 && (
              <div>
                {attributes.map((e) => (
                  <div key={e.prefix}>{e.render()}</div>
                ))}
              </div>
            )}
            {key as string}:{`${v}`}
          </div>
        );
      })}
    </div>
  );
}

// #endregion

// #region Test

export function TestDecorator() {
  class Simple {
    @prefix('Desc')
    @prefix('Title')
    a = 1;
    b = '2';
  }

  const v = objToInterface(new Simple());
  return <ObjectComponent value={v} classObj={Simple} />;
}

// #endregion
