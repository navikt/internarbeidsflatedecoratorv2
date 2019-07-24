import React, {useState} from 'react';
import Modal from 'nav-frontend-modal';
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {AlertStripeAdvarsel} from 'nav-frontend-alertstriper';
import Knapp, {Hovedknapp} from 'nav-frontend-knapper'
import {useWebsocket} from "../../hooks/use-webhook";
import {Listeners} from "../../utils/websocket-impl";
import {hentAktivEnhet, oppdaterAktivEnhet} from "../../context-api";

Modal.setAppElement(document.getElementById('root'));

interface Props {
    synced: boolean;
    valgtEnhet: string | null | undefined;

    onAccept(enhet: string): void;
}

function NyEnhetContextModal({synced, valgtEnhet, onAccept}: Props) {
    const [pending, setPending] = useState(false);
    const [open, setOpen] = useState(false);
    const [onsketEnhet, setOnsketEnhet] = useState<string | null>(null);

    const onDecline = () => {
        setPending(true);
        oppdaterAktivEnhet(valgtEnhet)
            .then(() => setPending(false));
    };
    const onAcceptHandler = () => {
        onAccept(onsketEnhet!);
        setOpen(false);
    };

    const wsListener: Listeners = {
        onMessage(event: MessageEvent): void {
            if (event.data === '"NY_AKTIV_ENHET"' && synced) {
                hentAktivEnhet()
                    .then(({aktivEnhet}) => {
                        setOpen(aktivEnhet !== valgtEnhet);
                        setOnsketEnhet(aktivEnhet);
                    })
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
                    Du har endret Enhet
                </Innholdstittel>
                <AlertStripeAdvarsel className="blokk-s">
                    Du har endret enhet i et annet vindu. Du kan ikke jobbe i 2 enheter samtidig. Velger du 'endre'
                    mister du arbeidet du ikke har lagret.
                </AlertStripeAdvarsel>
                <Normaltekst className="blokk-s">
                    Ønsker du å endre enhet til {onsketEnhet}?
                </Normaltekst>
                <div className="decorator-context-modal__footer">
                    <Hovedknapp disabled={pending} onClick={onAcceptHandler}>
                        Endre
                    </Hovedknapp>
                    <Knapp onClick={onDecline} type="standard" spinner={pending} autoDisableVedSpinner>
                        Behold
                    </Knapp>
                </div>
            </div>
        </Modal>
    );
}

export default React.memo(NyEnhetContextModal);