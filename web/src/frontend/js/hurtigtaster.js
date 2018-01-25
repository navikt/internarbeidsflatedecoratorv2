import { gosysLenke } from './menyConfig';
import { erAltG } from './utils/keyboard-utils';

function gosysHotkey(fnr) {
    return {
        matches: (e) => erAltG(e),
        execute() {
            window.location.href = gosysLenke(fnr).url;
        },
    };
}

export default function registrerHurtigknapper(document, fnr) {
    const handlers = [
        gosysHotkey(fnr),
    ];

    document.onkeyup = function (e) {
        handlers.forEach(handler => {
            if (handler.matches(e)) {
                handler.execute(e);
            }
        });
    };
}