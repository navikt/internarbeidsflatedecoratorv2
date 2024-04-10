import { useEffect } from 'react';
import { AppProps } from '../types/AppProps';
import { useHotkeyState } from '../states/HotkeyState';

export const useSyncHotkeys = ({ hotkeys, enableHotkeys = true }: AppProps) => {
  const clear = useHotkeyState().clear;
  const register = useHotkeyState().register;

  useEffect(() => {
    clear();
    if (!enableHotkeys) return;

    if (hotkeys?.length) {
      register(false, ...hotkeys);
    }
  }, [clear, enableHotkeys, hotkeys, register]);
};
