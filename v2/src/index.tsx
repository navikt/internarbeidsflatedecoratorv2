import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import Application, { Props } from './application';
import NAVSPA from '@navikt/navspa';
import './styles/main.less';

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');
}

console.warn('Deprecation notice - internarbeidsflatedecorator V2\nAnbefaler oppgradering til V2.1\nhttps://github.com/navikt/internarbeidsflatedecorator/tree/dev/v2.1');
NAVSPA.eksporter<Props>('internarbeidsflatefs', Application);
