import { gosysLenke, pesysLenke, arenaLenke } from './menyConfig';
import { erAltF5, erAltF3, erAltG, erAltI, erAltP } from './utils/keyboard-utils';
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
    ];

    return (e) => {
        const hotkey = getHotkey(hotkeys, e);
        if (hotkey) {
            hotkey.execute(e);
        }
    };
}
