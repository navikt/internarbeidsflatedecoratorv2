import React, { useEffect } from 'react';
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
import NewUserModal from './components/modals/NewUserModal';
import NewEnhetModal from './components/modals/NewEnhetModal';
import { useSyncStore } from './hooks/useSyncStore';
import useGlobalHandlers from './store/GlobalHandlers';
import classNames from 'classnames';

const App: React.FC<AppProps> = (props: AppProps) => {
  const { onLinkClick, isFullScreen } = props;

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
    useAppState.setState({ open: false })
  );

  const setHandler = useGlobalHandlers((state) => state.setHandler);

  useEffect(() => {
    if (onLinkClick) {
      setHandler('onLinkClick', (linkText, url) =>
        onLinkClick({ text: linkText, url })
      );
    }
  }, [setHandler, onLinkClick]);

  useEffect(() => {
    if (props.isFullScreen) {
      useAppState.setState({ open: true });
    }
  }, [props.isFullScreen]);

  return (
    <>
      <div className={classNames('dekorator', { 'dr-h-screen': isFullScreen })}
           data-theme="internarbeidsflatedecorator-theme">
        <header ref={ref}
                className={classNames('dr-font-arial', 'dr-text-white', { 'dr-h-full dr-flex dr-flex-col': isFullScreen })}>
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
