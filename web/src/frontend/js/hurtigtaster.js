import { gosysLenke, pesysLenke, arenaLenke } from './menyConfig';
import { erAltF5, erAltF3, erAltG, erAltI, erAltP } from './utils/keyboard-utils';
import { dispatchFjernPersonEvent, setFokusSokefelt } from './events';

function lagHotkey(hotkeyPredicate, action) {
    return {
        matches: (e) => hotkeyPredicate(e),
        execute: action,
    };
}

function redirect(lenke) {
    return () => {
        window.location.href = lenke;
    };
}

export default function registrerHurtigknapper(fnr) {
    const handlers = [
        lagHotkey(erAltG, redirect(gosysLenke(fnr).url)),
        lagHotkey(erAltI, redirect(pesysLenke(fnr).url)),
        lagHotkey(erAltP, redirect(arenaLenke(fnr).url)),
        lagHotkey(erAltF5, dispatchFjernPersonEvent),
        lagHotkey(erAltF3, setFokusSokefelt),
    ];

    return (e) => {
        handlers.forEach(handler => {
            if (handler.matches(e)) {
                handler.execute(e);
            }
        });
    };

}