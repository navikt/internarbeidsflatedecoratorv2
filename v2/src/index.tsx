import Application, { Props } from './application';
import NAVSPA from './utils/NAVSPA';
import 'nav-frontend-core';
import './styles/main.less';

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');
}


NAVSPA.eksporter<Props>("internarbeidsflatefs", Application);
