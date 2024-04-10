import React from 'react';
import './index.css';
import { AppProps } from './types/AppProps';
import { useOnOutsideClick } from './hooks/useOnOutsideClick';
import Banner from './components/Banner';
import useSyncAppState from './hooks/useSyncAppState';
import { useAppState } from './states/AppState';
import ErrorMessage from './components/ErrorMessageDisplay';
import Menu from './components/Menu';
import { useSyncHotkeys } from './hooks/useSyncHotkeys';
import { useHotkeys } from './hooks/useHotkeys';
import { useEffect } from 'react';
import NewUserModal from './components/modals/NewUserModal';
import NewEnhetModal from './components/modals/NewEnhetModal';
import { useSyncStore } from './hooks/useSyncStore';
import useGlobalHandlers from './store/GlobalHandlers';

const App: React.FC<AppProps> = (props: AppProps) => {
  const { onLinkClick } = props;

  useSyncStore(props);
  useSyncAppState(props);
  useSyncHotkeys(props);
  const { startListening, stopListening } = useHotkeys();

  useEffect(() => {
    if (props.enableHotkeys) {
      startListening();
    }
    return () => stopListening();
  }, [props.enableHotkeys, startListening, stopListening]);

  const ref = useOnOutsideClick<HTMLElement>(() =>
    useAppState.setState({ open: false }),
  );

  const setHandler = useGlobalHandlers((state) => state.setHandler);

  useEffect(() => {
    if (onLinkClick) {
      setHandler('onLinkClick', (linkText, url) =>
        onLinkClick({ text: linkText, url }),
      );
    }
  }, [setHandler, onLinkClick]);

  return (
    <>
      <div className="dekorator" data-theme="internarbeidsflatedecorator-theme">
        <header ref={ref} className="dr-font-arial dr-text-white">
          <Banner />
          <Menu />
          <ErrorMessage />
        </header>
      </div>
      <NewUserModal />
      <NewEnhetModal />
    </>
  );
};

export default App;
