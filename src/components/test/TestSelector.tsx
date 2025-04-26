import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { create } from 'zustand';

// #region Redux Selector

const reduxFooSlice = createSlice({
  name: 'foo',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

const reduxBarSlice = createSlice({
  name: 'bar',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

const reduxStore = configureStore({
  reducer: {
    foo: reduxFooSlice.reducer,
    bar: reduxBarSlice.reducer,
  },
});

type RootState = ReturnType<typeof reduxStore.getState>;

const selectReduxFoo = (state: RootState) => {
  console.log('selectFoo called');
  return state.foo.value;
};

const selectReduxBar = (state: RootState) => {
  console.log('selectBar called');
  return state.bar.value;
};

function ReduxFooUser() {
  const fooValue = useSelector(selectReduxFoo);
  const { dispatch } = reduxStore;
  return (
    <div>
      <div>Foo Value: {fooValue}</div>
      <button onClick={() => dispatch(reduxFooSlice.actions.increment())}>Increment Foo</button>
      <button onClick={() => dispatch(reduxFooSlice.actions.decrement())}>Decrement Foo</button>
    </div>
  );
}

function ReduxBarUser() {
  const barValue = useSelector(selectReduxBar);
  const { dispatch } = reduxStore;
  return (
    <div>
      <div>Bar Value: {barValue}</div>
      <button onClick={() => dispatch(reduxBarSlice.actions.increment())}>Increment Bar</button>
      <button onClick={() => dispatch(reduxBarSlice.actions.decrement())}>Decrement Bar</button>
    </div>
  );
}

function TestReduxSelector() {
  return (
    <Provider store={reduxStore}>
      <div>
        <h1>Test Redux Selector</h1>
        <ReduxFooUser />
        <ReduxBarUser />
      </div>
    </Provider>
  );
}

// #endregion

// #region Zustand Selector

interface FooSlice {
  foo: { value: number };
  incrementFoo: () => void;
  decrementFoo: () => void;
}

interface BarSlice {
  bar: { value: number };
  incrementBar: () => void;
  decrementBar: () => void;
}

type ZustandState = FooSlice & BarSlice;

const createFooSlice: (set: (fn: (state: ZustandState) => Partial<ZustandState>) => void) => FooSlice = (set) => ({
  foo: { value: 0 },
  incrementFoo: () => set((state) => ({ foo: { value: state.foo.value + 1 } })),
  decrementFoo: () => set((state) => ({ foo: { value: state.foo.value - 1 } })),
});

const createBarSlice: (set: (fn: (state: ZustandState) => Partial<ZustandState>) => void) => BarSlice = (set) => ({
  bar: { value: 0 },
  incrementBar: () => set((state) => ({ bar: { value: state.bar.value + 1 } })),
  decrementBar: () => set((state) => ({ bar: { value: state.bar.value - 1 } })),
});

const useZustandStore = create<ZustandState>((set) => ({
  ...createFooSlice(set),
  ...createBarSlice(set),
}));

const selectZustandFoo = (state: ZustandState) => {
  console.log('selectZustandFoo called');
  return state.foo.value;
};

const selectZustandBar = (state: ZustandState) => {
  console.log('selectZustandBar called');
  return state.bar.value;
};

function ZustandFooUser() {
  const fooValue = useZustandStore(selectZustandFoo);
  const incrementFoo = useZustandStore((state) => state.incrementFoo);
  const decrementFoo = useZustandStore((state) => state.decrementFoo);
  return (
    <div>
      <div>Foo Value: {fooValue}</div>
      <button onClick={incrementFoo}>Increment Foo</button>
      <button onClick={decrementFoo}>Decrement Foo</button>
    </div>
  );
}

function ZustandBarUser() {
  const barValue = useZustandStore(selectZustandBar);
  const incrementBar = useZustandStore((state) => state.incrementBar);
  const decrementBar = useZustandStore((state) => state.decrementBar);
  return (
    <div>
      <div>Bar Value: {barValue}</div>
      <button onClick={incrementBar}>Increment Bar</button>
      <button onClick={decrementBar}>Decrement Bar</button>
    </div>
  );
}

function TestZustandSelector() {
  const [isShowFoo, setIsShowFoo] = useState(true);
  const [isShowBar, setIsShowBar] = useState(true);
  return (
    <div>
      <h1>Test Zustand Selector</h1>
      <button onClick={() => setIsShowFoo((prev) => !prev)}>Toggle Foo</button>
      <button onClick={() => setIsShowBar((prev) => !prev)}>Toggle Bar</button>
      {isShowFoo && <ZustandFooUser />}
      {isShowBar && <ZustandBarUser />}
    </div>
  );
}

// #endregion

export function TestSelectorEfficiency() {
  return (
    <div>
      <h1>Test Selector Efficiency</h1>
      <TestReduxSelector />
      <hr />
      <TestZustandSelector />
    </div>
  );
}
