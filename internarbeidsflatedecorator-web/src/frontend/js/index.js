import init from './init';
import personsok from './personsok';
import varsel from './varsel';
import saksbehandler from './vis-saksbehandler';

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', personsok);

document.varsel = varsel;
document.saksbehandler = saksbehandler;