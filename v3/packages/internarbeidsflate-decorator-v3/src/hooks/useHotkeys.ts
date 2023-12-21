import { useMemo } from 'react';
import { useHotkeyState } from '../states/HotkeyState';
import { ActionHotKey, Hotkey, HotkeyObject } from '../types/Hotkey';

export const useHotkeys = () => {
  const hotkeys = useHotkeyState((state) => state.decoratorHotkeys);

  return useMemo(() => {
    function listener(event: KeyboardEvent) {
      hotkeyListener(event, hotkeys);
    }

    const startListening = () => {
      document.addEventListener('keydown', listener);
    };

    const stopListening = () => {
      document.removeEventListener('keydown', listener);
    };

    return { startListening, stopListening };
  }, [hotkeys]);
};

const hotkeyListener = (event: KeyboardEvent, hotkeys: Hotkey[]) => {
  for (const hotkey of hotkeys) {
    if (matches(hotkey.key, event)) {
      if (isActionHotkey(hotkey)) {
        hotkey.action(event);
        event.preventDefault();
        return;
      }
    }
  }
};

const matches = (hotkey: HotkeyObject, event: KeyboardEvent): boolean => {
  const wantedKey = hotkey.char.toLowerCase();
  const actualKey = (
    event.code ? event.code.replace('Key', '') : event.key
  ).toLowerCase();

  return (
    isSameKey(wantedKey, actualKey) &&
    shouldHaveAlt(hotkey, event) &&
    shouldHaveCtrl(hotkey, event) &&
    shouldHaveMeta(hotkey, event) &&
    shouldHaveShift(hotkey, event)
  );
};

const isSameKey = (wantedKey: string, actualKey: string): boolean =>
  wantedKey === actualKey;
const shouldHaveAlt = (hotkey: HotkeyObject, event: KeyboardEvent) =>
  Boolean(hotkey.altKey) === event.altKey;
const shouldHaveCtrl = (hotkey: HotkeyObject, event: KeyboardEvent) =>
  Boolean(hotkey.ctrlKey) === event.ctrlKey;
const shouldHaveMeta = (hotkey: HotkeyObject, event: KeyboardEvent) =>
  Boolean(hotkey.metaKey) === event.metaKey;
const shouldHaveShift = (hotkey: HotkeyObject, event: KeyboardEvent) =>
  Boolean(hotkey.shiftKey) === event.shiftKey;

const isActionHotkey = (hotkey: Hotkey): hotkey is ActionHotKey => {
  return 'action' in hotkey;
};
