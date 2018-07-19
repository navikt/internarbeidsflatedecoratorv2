import { gosysLenke, pesysLenke, arenaLenke, foreldrepengerLenke } from './menyConfig';
import { erAltF5, erAltK, erAltG, erAltI, erAltP, erAltF3 } from './utils/keyboard-utils';
import { dispatchFjernPersonEvent, setFokusSokefelt } from './events';

function lagHotkey(hotkeyPredicate, action) {
    return {
        matches: (e) => hotkeyPredicate(e),
        execute: action,
    };
}

function apneINyttVindu(lenke) {
    return () => {
        window.open(lenke, '_blank');
    };
}

function getHotkey(hotkeys, e) {
    return hotkeys.find(hotkey => hotkey.matches(e));
}

export default function onkeyup(fnr) {
    const hotkeys = [
        lagHotkey(erAltG, apneINyttVindu(gosysLenke(fnr).url)),
        lagHotkey(erAltI, apneINyttVindu(pesysLenke(fnr).url)),
        lagHotkey(erAltP, apneINyttVindu(arenaLenke(fnr).url)),
        lagHotkey(erAltF5, dispatchFjernPersonEvent),
        lagHotkey(erAltF3, setFokusSokefelt),
        lagHotkey(erAltK, apneINyttVindu(foreldrepengerLenke().url)),
    ];

    return (e) => {
        const hotkey = getHotkey(hotkeys, e);
        if (hotkey) {
            hotkey.execute(e);
        }
    };
}
