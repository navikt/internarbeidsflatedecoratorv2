import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import Application, { Props } from './application';
import NAVSPA from '@navikt/navspa';
import './styles/main.less';

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');
}

NAVSPA.eksporter<Props>('internarbeidsflatefs', Application);
