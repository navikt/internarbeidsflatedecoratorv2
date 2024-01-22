import { AppState } from '../states/AppState';

interface DomainProps {
  enhet?: string | undefined;
  veiledersIdent: string;
  accessToken?: string | undefined;
  fnr?: string | undefined;
  userKey?: string | undefined;
  enableHotkeys?: boolean | undefined;
  fetchActiveEnhetOnMount?: boolean | undefined;
  fetchActiveUserOnMount?: boolean | undefined;
  onBeforeRequest?: (headers: HeadersInit) => HeadersInit | undefined;
  onEnhetChanged: (enhet?: string | null) => void;
  onFnrChanged: (fnr?: string | null) => void;
}

export interface AppProps extends DomainProps, Omit<AppState, 'open'> { }
