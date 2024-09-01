import React from 'react';

export const defalutAppConfig = {
  useStrictMode: true,
};

export type SetConfig = <T extends keyof typeof defalutAppConfig>(key: T, value: (typeof defalutAppConfig)[T]) => void;

export interface IAppContext {
  config: typeof defalutAppConfig;
  setConfig: SetConfig;
}

export const AppContext = React.createContext<IAppContext>({ config: defalutAppConfig, setConfig: () => {} });
