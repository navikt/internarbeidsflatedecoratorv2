import { useEffect } from 'react';
import { useAppState } from '../states/AppState';
import { AppProps } from '../types/AppProps';

const useSyncAppState = (props: AppProps) => {
  useEffect(() => {
    useAppState.setState({ ...props });
  }, [props]);
};

export default useSyncAppState;
