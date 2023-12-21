import { useEffect } from 'react';
import { Hotkey } from '../types/Hotkey';
import { Environment } from '../utils/environmentUtils';
import { arenaUrl, fpSakUrl, gosysUrl, pesysUrl } from '../utils/urlUtils';
import { useHotkeyState } from '../states/HotkeyState';

interface Props {
  environment: Environment;
  fnr?: string | undefined | null;
  aktoerId?: string | undefined | null;
}

const openurl = (url: string) => () => window.open(url, '_blank');

const buildHotkey = (
  char: string,
  url: string,
  description: string,
): Hotkey => ({
  key: { char, altKey: true },
  action: openurl(url),
  description,
});

const generateHotkeys = ({ environment, fnr, aktoerId }: Props): Hotkey[] => [
  buildHotkey('G', gosysUrl(environment, fnr), 'Gå til Gosys'),
  buildHotkey('I', pesysUrl(environment, fnr), 'Gå til Pesys'),
  buildHotkey('P', arenaUrl({ environment, fnr }), 'Gå til Arena'),
  buildHotkey('K', fpSakUrl(environment, aktoerId), 'Gå til fpsak'),
];

export const useLinkHotkeys = ({ environment, fnr, aktoerId }: Props) => {
  const registerHotkeys = useHotkeyState().register;
  useEffect(() => {
    const hotkeys = generateHotkeys({ environment, fnr, aktoerId });
    registerHotkeys(true, ...hotkeys);
  }, [environment, fnr, aktoerId, registerHotkeys]);
};
