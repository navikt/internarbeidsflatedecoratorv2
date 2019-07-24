import React, { useState } from 'react';
import Modal from 'nav-frontend-modal';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { hentAktivBruker, oppdaterAktivBruker } from '../../context-api';
import { Listeners } from '../../utils/websocket-impl';
import { useWebsocket } from '../../hooks/use-webhook';

Modal.setAppElement(document.getElementById('root'));

interface Props {
    synced: boolean;
    valgtFnr: string | null | undefined;

    onAccept(fnr: string): void;
}

function NyBrukerContextModal({ synced, valgtFnr, onAccept }: Props) {
    const [pending, setPending] = useState(false);
    const [open, setOpen] = useState(false);
    const [onsketFnr, setOnsketFnr] = useState<string | null>(null);

    const onDecline = () => {
        setPending(true);
        oppdaterAktivBruker(valgtFnr).then(() => setPending(false));
    };

    const onAcceptHandler = () => {
        onAccept(onsketFnr!);
        setOpen(false);
    };

    const wsListener: Listeners = {
        onMessage(event: MessageEvent): void {
            if (event.data === '"NY_AKTIV_BRUKER"' && synced) {
                hentAktivBruker().then(({ aktivBruker }) => {
                    setOpen(aktivBruker !== valgtFnr);
                    setOnsketFnr(aktivBruker);
                });
            }
        }
    };
    useWebsocket('ws://localhost:2999/hereIsWS', wsListener);

    return (
        <Modal
            contentLabel="Brukercontext"
            isOpen={open}
            closeButton={false}
            onRequestClose={() => true}
        >
            <div className="decorator-context-modal">
                <Innholdstittel tag="h1" className="blokk-s">
                    Du har endret bruker
                </Innholdstittel>
                <AlertStripeAdvarsel className="blokk-s">
                    Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig.
                    Velger du å endre bruker mister du arbeidet du ikke har lagret.
                </AlertStripeAdvarsel>
                <Normaltekst className="blokk-s">{`Ønsker du å endre bruker til ${onsketFnr}?`}</Normaltekst>
                <div className="decorator-context-modal__footer">
                    <Hovedknapp disabled={pending} onClick={onAcceptHandler}>
                        Endre
                    </Hovedknapp>
                    <Knapp
                        type="standard"
                        onClick={onDecline}
                        spinner={pending}
                        autoDisableVedSpinner
                    >
                        Behold
                    </Knapp>
                </div>
            </div>
        </Modal>
    );
}

export default NyBrukerContextModal;
