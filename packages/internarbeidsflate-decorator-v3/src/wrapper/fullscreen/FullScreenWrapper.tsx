import React from 'react';
import Decorator from '../../App';

const FullScreenWrapper = () => {
  // En minimal Decorator som viser en fullskjermvisning av applikasjonen
  return <Decorator
    appName="Test app"
    enableHotkeys
    showEnheter={true}
    showSearchArea={true}
    showHotkeys={true}
    environment={'q2'}
    urlFormat={'LOCAL'}
    enhet={''}
    fnr={''}
    fetchActiveEnhetOnMount
    fetchActiveUserOnMount
    onEnhetChanged={() => {
    }}
    onFnrChanged={() => {
    }}
    isFullScreen={true}
  />;
};

export default FullScreenWrapper;
