import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import NAVSPA from '@navikt/navspa';
import Application from './application';
import './styles/nav-frontend.css';
import { ApplicationProps } from './domain';

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');
}

NAVSPA.eksporter<ApplicationProps>('internarbeidsflatefs', Application);
