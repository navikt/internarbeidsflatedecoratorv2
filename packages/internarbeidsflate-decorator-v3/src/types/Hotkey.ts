export interface HotkeyObject {
  char: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

export interface HotkeyDescription {
  key: HotkeyObject;
  description: string;
  forceOverride?: boolean;
}

export interface ActionHotKey extends HotkeyDescription {
  action(event: KeyboardEvent): void;
}

export interface DocumentingHotKey extends HotkeyDescription {
  documentationOnly: boolean;
}

export type Hotkey = ActionHotKey | DocumentingHotKey;

export type InternalHotkey = Hotkey & {
  id: string;
  isDefaultKey: boolean;
};
