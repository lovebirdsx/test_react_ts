import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import { getWorker } from './api/server';
import { store } from './app/store';
import { fetchUsers } from './features/users/userSlice';
import { AppContext, SetConfig, defalutAppConfig } from './app/context';

function Index() {
  const [appConfig, setAppConfig] = React.useState(defalutAppConfig);

  const handleSetConfig = React.useCallback<SetConfig>((key, value) => {
    setAppConfig((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const appElement = (
    <AppContext.Provider value={{ config: appConfig, setConfig: handleSetConfig }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider
          defaultOptions={{
            confirmationText: '确认',
            cancellationText: '取消',
          }}
        >
          <App />
        </ConfirmProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );

  if (appConfig.useStrictMode) {
    return <React.StrictMode>{appElement}</React.StrictMode>;
  }

  return appElement;
}

async function main() {
  if (process.env.NODE_ENV === 'development') {
    await getWorker().start({ onUnhandledRequest: 'bypass' });
  }

  store.dispatch(fetchUsers());

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<Index />);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

main();
