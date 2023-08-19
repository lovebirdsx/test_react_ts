import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { getWorker } from './api/server';
import { CssBaseline } from '@mui/material';

async function main() {
  const worker = getWorker();
  await worker.start({ onUnhandledRequest: 'bypass'});

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <CssBaseline />
        <App />
      </React.StrictMode>
    </ThemeProvider>
  );
  
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

main();
