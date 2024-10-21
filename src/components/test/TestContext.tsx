import * as React from 'react';
import { Button, FormLabel } from '@mui/material';
import { create } from 'zustand';

const ContextByStore: React.FC = () => {
  interface ContextState {
    name: string;
    setName: (name: string) => void;
  }

  const useContextStore = create<ContextState>((set) => ({
    name: 'value1',
    setName: (name: string) => set({ name }),
  }));

  const ContextProvider: React.FC = () => {
    const name = useContextStore((state) => state.name);
    return (
      <>
        <FormLabel>{name}</FormLabel>
      </>
    );
  };

  const ChangeContext: React.FC = () => {
    const setName = useContextStore((state) => state.setName);
    return (
      <div>
        <Button onClick={() => setName('value1')}>value1</Button>
        <Button onClick={() => setName('value2')}>value2</Button>
        <Button onClick={() => setName('value3')}>value3</Button>
      </div>
    );
  };

  return (
    <div>
      <ContextProvider />
      <ChangeContext />
    </div>
  );
};

const ContextByHook: React.FC = () => {
  const context = React.createContext<string>('value1');
  const [name, setName] = React.useState('value1');

  const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <context.Provider value={name}>{children}</context.Provider>;
  };

  const ChangeContext: React.FC = () => {
    return (
      <div>
        <Button onClick={() => setName('value1')}>value1</Button>
        <Button onClick={() => setName('value2')}>value2</Button>
        <Button onClick={() => setName('value3')}>value3</Button>
      </div>
    );
  };

  const ContextConsumer: React.FC = () => {
    const value = React.useContext(context);
    return <FormLabel>{value}</FormLabel>;
  };

  return (
    <div>
      <ContextProvider>
        <ContextConsumer />
        <ChangeContext />
      </ContextProvider>
    </div>
  );
};

const TIPS = `测试Context的使用，TIPS：重绘状态可以通过devtool查看
* Context By Hook
  * 使用React库创建Context，通过Provider和Consumer管理状态
  * context改变时会重绘
* Context By Store
  * 使用Zustand库创建Context，通过Store管理状态
  * 可以避免不必要的重绘
`;

export const TestContext: React.FC = () => {
  return (
    <div>
      <section className="test-section">
        <pre>{TIPS}</pre>
      </section>
      <h2>Context By Hook</h2>
      <ContextByHook />
      <h2>Context By Store</h2>
      <ContextByStore />
    </div>
  );
};
