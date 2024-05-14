import { useEffect } from 'react';
import { AppProps } from '../types/AppProps';
import useSyncAppState from './useSyncAppState';
import { useSyncHotkeys } from './useSyncHotkeys';
import { useHotkeys } from './useHotkeys';
import { useSyncStore } from './useSyncStore';
import useGlobalHandlers from '../store/GlobalHandlers';

const useAppLogic = (props: AppProps) => {
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

  const setHandler = useGlobalHandlers((state) => state.setHandler);

  useEffect(() => {
    if (onLinkClick) {
      setHandler('onLinkClick', (linkText, url) =>
        onLinkClick({ text: linkText, url }),
      );
    }
  }, [setHandler, onLinkClick]);
};

export default useAppLogic;
