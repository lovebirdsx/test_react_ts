import React from 'react';
import { ThemeUIProvider } from 'theme-ui';
import { polaris } from '@theme-ui/presets'
import { TestMain } from './components/test/Main';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <ThemeUIProvider theme={polaris}>
        <TestMain />
      </ThemeUIProvider>
    );
  }
}

export default App;
