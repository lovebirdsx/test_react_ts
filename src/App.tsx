import React from 'react';
import { TestMain } from './components/test/Main';
import { ThemeProvider } from '@emotion/react';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <ThemeProvider theme={{}}>
        <TestMain />
      </ThemeProvider>
    );
  }
}

export default App;
