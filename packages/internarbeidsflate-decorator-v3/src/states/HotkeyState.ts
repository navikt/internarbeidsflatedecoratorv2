import { create } from 'zustand';
import { InternalHotkey, Hotkey, HotkeyObject } from '../types/Hotkey';

export const useHotkeyState = create<HotkeyState>((set) => {
  let internalHotkeys: Record<string, InternalHotkey> = {};

  const register = (isDefaultKey: boolean = false, ...hotkeys: Hotkey[]) => {
    for (const hotkey of hotkeys) {
      const hotkeyDescription = getHotkeyDescription(hotkey.key);
      checkExistingHotkeys(
        hotkeyDescription,
        hotkey,
        internalHotkeys,
        isDefaultKey,
      );
      internalHotkeys[hotkeyDescription] = {
        ...hotkey,
        isDefaultKey,
        id: hotkeyDescription,
      };
    }
    set({ decoratorHotkeys: Object.values(internalHotkeys) });
  };

  const unregister = (hotkey: Hotkey) => {
    const hotkeyDescription = getHotkeyDescription(hotkey.key);
    delete internalHotkeys[hotkeyDescription];
    set({ decoratorHotkeys: Object.values(internalHotkeys) });
  };

  const clear = () => {
    const res = { ...internalHotkeys };
    for (const [id, key] of Object.entries(internalHotkeys)) {
      if (key.isDefaultKey) continue;
      delete res[id];
    }
    internalHotkeys = res;
    set({ decoratorHotkeys: Object.values(internalHotkeys) });
  };

  return {
    decoratorHotkeys: [],
    register,
    unregister,
    clear,
  };
});

interface HotkeyState {
  decoratorHotkeys: InternalHotkey[];
  register: (isDefaultKey: boolean, ...hotkey: Hotkey[]) => void;
  unregister: (hotkey: Hotkey) => void;
  clear: () => void;
}

const getHotkeyDescription = (hotkey: HotkeyObject): string => {
  let res = '';
  if (hotkey.ctrlKey) res += 'Ctrl+';
  if (hotkey.altKey) res += 'Alt+';
  if (hotkey.metaKey) res += 'Meta+';
  if (hotkey.shiftKey) res += 'Shift+';
  res += hotkey.char;
  return res;
};

const checkExistingHotkeys = (
  hotkeyDescription: string,
  hotkey: Hotkey,
  hotkeys: Record<string, Hotkey>,
  isDefaultKey: boolean,
) => {
  const existingHotkey = hotkeys[hotkeyDescription];
  if (!existingHotkey) {
    return;
  }

  if (!hotkey.forceOverride && !isDefaultKey) {
    throw new Error(
      'Prøvde å legge til en hotkey som allerede er registrert. Hvis dette var med vilje; legg til `forceOverride: true` på hotkey objektet.',
    );
  }
};
