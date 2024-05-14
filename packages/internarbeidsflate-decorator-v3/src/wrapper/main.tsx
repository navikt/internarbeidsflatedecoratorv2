import React from 'react';
import ReactDOM from 'react-dom/client';
import Wrapper from './Wrapper';
import FullScreenWrapper from './FullScreenWrapper';


const isFullscreen = import.meta.env.VITE_DECORATOR_MODE === 'fullscreen';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isFullscreen ? <FullScreenWrapper /> : <Wrapper />}
  </React.StrictMode>
);
