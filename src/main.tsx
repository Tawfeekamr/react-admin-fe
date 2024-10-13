import ReactDOM from 'react-dom/client';
import {Toaster} from "react-hot-toast";
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
          <Toaster />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
