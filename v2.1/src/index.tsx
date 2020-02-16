import 'core-js/stable';
import Application  from './application';
import NAVSPA from '@navikt/navspa';
import './styles/main.less';
import {ApplicationProps} from "./domain";

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');
}

NAVSPA.eksporter<ApplicationProps>('internarbeidsflatefs', Application);
