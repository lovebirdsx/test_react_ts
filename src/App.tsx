import React from 'react';
import './App.css';
import GraphEditor from './components/GraphEditor';
import { Hello } from './components/Hello';
import { TestNested } from './components/TestNested';

export interface IPersonContext {
  name: string;
  age: number;
  love: string;
}

const contextMap: {[name: string] : IPersonContext} = {
  me: {
    name: 'lovebird',
    age: 18,
    love: 'TypeScript',
  },
  foo: {
    name: 'Foo',
    age: 21,
    love: 'JavaScript',
  },
  bar: {
    name: 'Bar',
    age: 23,
    love: 'CSharp',
  }
}

export const PersonContext = React.createContext<IPersonContext>(contextMap.me);

interface AppState {
  context: IPersonContext
}

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      context: contextMap.me
    }
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        <PersonContext.Provider value={this.state.context}>
          <header className="App-header">
            {/* <button onClick={() => this.setState({context: contextMap.me})}>me</button>
            <button onClick={() => this.setState({context: contextMap.foo})}>foo</button>
            <button onClick={() => this.setState({context: contextMap.bar})}>bar</button>
            <Hello compiler='TypeScript' framework='React'/>
            <GraphEditor></GraphEditor> */}
            <TestNested/>
          </header>
        </PersonContext.Provider>
      </div>
    );
  }
}

export default App;
