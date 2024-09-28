/**
 * 在 React 开发中，通常推荐使用普通的对象（Object）而不是用户自定义的类（Class）。
 * 这是因为普通对象在 React 生态系统中具有更好的兼容性和可预测性。以下是具体原因：
 *
 * * 序列化和反序列化的便利性：普通对象可以轻松地进行序列化（转换为字符串）和反序列化，这在状态持久化、服务端渲染和调试工具（如 Redux DevTools）中非常重要。自定义类可能包含方法和原型链，导致序列化过程变得复杂或不可行。
 * * 不可变性：React 状态应视为不可变的，这有助于避免副作用并使状态变化可预测。普通对象可以方便地进行浅拷贝或深拷贝，以实现状态的不可变更新。而自定义类可能包含内部状态或方法，增加了实现不可变性的难度。
 * * 简化和可预测性：使用普通对象避免了由于类的继承、方法重写等带来的复杂性。这使得代码更容易理解和维护，减少了潜在的错误。
 * * 与 React 生态系统兼容性：许多 React 工具和库（如 Redux）都假设状态是由普通对象组成的。这些工具可能无法正确处理自定义类，导致意外的行为。
 * * 函数式编程范式：React 趋向于函数式编程，鼓励使用纯函数和不可变数据。普通对象更符合这一范式，而类通常与面向对象编程相关。
 * * 性能考虑：普通对象的创建和垃圾回收通常比自定义类实例更高效，因为它们更简单，开销更小。
 *
 * 综上所述，使用普通对象可以提高代码的可靠性、可维护性和与 React 生态系统的兼容性，因此在 React 开发中更为推荐。
 */
import React from 'react';

class Foo {
  name = 'foo';
  city = 'city';
  hello() {
    console.log(this.name, this.city);
  }
}

interface ITestFoo {
  foo: Foo;
  onModify: (foo: Foo) => void;
}

function cloneInstance<T>(instance: T): T {
  const newInst = Object.create(Object.getPrototypeOf(instance));
  Object.assign(newInst, instance);
  return newInst;
}

const TestFoo: React.FC<ITestFoo> = ({ foo, onModify }) => {
  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Foo) => {
    const newFoo = cloneInstance(foo);
    newFoo[key] = e.target.value as any;
    onModify(newFoo);
  };

  return (
    <div>
      <div>
        <input type="text" value={foo.name} onChange={(e) => onChangeField(e, 'name')} />
      </div>
      <div>
        <input type="text" value={foo.city} onChange={(e) => onChangeField(e, 'city')} />
      </div>
      <div>
        name: {foo.name} city: {foo.city}
      </div>
      <div>
        <button onClick={() => foo.hello()}>Info</button>
      </div>
    </div>
  );
};

export const TestClassProps: React.FC = () => {
  const [foo, setFoo] = React.useState(new Foo());
  return (
    <div>
      <h1>TestClassProps</h1>
      <TestFoo foo={foo} onModify={setFoo} />
    </div>
  );
};
