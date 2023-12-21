import App from  './App'
import NAVSPA from '@navikt/navspa'
import { AppProps } from './types/AppProps'
export type { AppProps } 
export type { Environment, UrlEnvironment, UrlFormat } from './utils/environmentUtils'
export type { Veileder } from './types/Veileder'
export type { Enhet } from './types/Enhet'
export default App 


NAVSPA.eksporter<AppProps>('internarbeidsflatedecorator', App);