import React, {useState} from 'react';
import {MaybeCls} from "@nutgaard/maybe-ts";
import Modal from 'nav-frontend-modal';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import {UseFetchHook} from "../../hooks/use-fetch";
import {AktivBruker} from "../../domain";

Modal.setAppElement(document.getElementById('root'));

interface Props {
    valgtFnr: string | undefined | null;
    contextFnr: UseFetchHook<AktivBruker>
    onAccept(fnr: string):void;
    onDecline(fnr: string | undefined | null):void;
}

function NyBrukerContextModal(props: Props) {
    const [ pending, setPending ] = useState(false);
    const open: boolean = props.contextFnr.data
        .map((contextFnr: AktivBruker) => {
            const beggeHarVerdi = !!contextFnr.aktivBruker && !!props.valgtFnr;
            return beggeHarVerdi && contextFnr.aktivBruker !== props.valgtFnr;
        })
        .withDefault(false);
    const onsketFnr = props.contextFnr.data
        .flatMap((contextFnr: AktivBruker) => MaybeCls.of(contextFnr.aktivBruker))
        .withDefault('');

    const onDecline = () => {
        setPending(true);
        fetch('/modiacontextholder/api/context', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                verdi: props.valgtFnr,
                eventType: 'NY_AKTIV_BRUKER'
            })
        })
            .then(() => props.contextFnr.refetch())
            .then(() => setPending(false))
            .then(() => props.onDecline(props.valgtFnr))
    };

    return (
        <Modal
            contentLabel="Brukercontext"
            isOpen={open}
            closeButton={false}
            onRequestClose={() => true}
        >
            <div className="brukercontext__modal">
                <Innholdstittel tag="h1" className="blokk-s">
                    Du har endret bruker
                </Innholdstittel>
                <AlertStripeInfo className="blokk-s">
                    Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig. Velger du å
                    endre bruker mister du arbeidet du ikke har lagret.
                </AlertStripeInfo>
                <Normaltekst className="blokk-s">
                    {`Ønsker du å endre bruker til ${onsketFnr}?`}
                </Normaltekst>
                <div className="modal-footer">
                    <Hovedknapp disabled={pending} onClick={() => props.onAccept(onsketFnr)}>
                        Endre
                    </Hovedknapp>
                    <Knapp type="standard" onClick={onDecline} spinner={pending} autoDisableVedSpinner>
                        Behold
                    </Knapp>
                </div>
            </div>
        </Modal>
    );
}
export default NyBrukerContextModal;
