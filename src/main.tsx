import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/index.css';
import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css'; // ✅ Required for RainbowKit UI

import { AppKitProvider } from './lib/walletConnect';
import { AppRouterProvider } from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppKitProvider>
      <AppRouterProvider />
    </AppKitProvider>
  </React.StrictMode>
);
