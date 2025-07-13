import React from 'react';
import ReactDOM from 'react-dom/client';
import "@fontsource/inter/index.css";
import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { withTonConnect } from './lib/ton-connect';
import { AppRouterProvider } from './routes';

const RootApp = withTonConnect(<AppRouterProvider />);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{RootApp}</React.StrictMode>
);
