import React from 'react';
import ReactDOM from 'react-dom/client';
import Wrapper from './Wrapper';
import FullScreenWrapper from './FullScreenWrapper';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {import.meta.env.VITE_DECORATOR_MODE === 'fullscreen' ? <FullScreenWrapper /> : <Wrapper />}
  </React.StrictMode>
);
