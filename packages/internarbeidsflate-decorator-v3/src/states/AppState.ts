import { create } from 'zustand';
import { Hotkey } from '../types/Hotkey';
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
  isFullScreen: false,
}));

export interface AppState {
  appName: string;
  open: boolean;
  hotkeys?: Hotkey[];
  markup?: Markup;
  showEnheter: boolean;
  showSearchArea: boolean;
  showHotkeys: boolean;
  environment: Environment;
  urlFormat: UrlFormat;
  proxy?: string | undefined;
  isFullScreen?: boolean;
}
