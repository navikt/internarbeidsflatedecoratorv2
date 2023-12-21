import { create } from 'zustand';
import { Hotkey } from '../types/Hotkey';
import { TogglesConfig } from '../types/TogglesConfig';
import { Markup } from '../types/Markup';
import { Environment, UrlFormat } from '../utils/environmentUtils';

export const useAppState = create<AppState>(() => ({
  appName: '',
  open: false,
  showEnheter: true,
  showSearchArea: true,
  showHotkeys: true,
  environment: 'q2',
  urlFormat: 'NAV_NO',
}));

export interface AppState {
  appName: string;
  open: boolean;
  hotkeys?: Hotkey[];
  toggles?: TogglesConfig;
  markup?: Markup;
  showEnheter: boolean;
  showSearchArea: boolean;
  showHotkeys: boolean;
  environment: Environment;
  urlFormat: UrlFormat;
  proxy?: string | undefined;
  contextholderUrl?: string | undefined;
}
