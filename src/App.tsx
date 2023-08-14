import React from 'react';
import { TestMain } from './components/test/Main';
import { Provider } from 'react-redux';
import { store } from './app/store';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <TestMain />
      </Provider>
    );
  }
}

export default App;
