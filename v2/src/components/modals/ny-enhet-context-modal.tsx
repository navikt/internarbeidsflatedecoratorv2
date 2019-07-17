import React, {useState} from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {AlertStripeAdvarsel} from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp} from 'nav-frontend-knapper'
import {UseFetchHook} from "../../hooks/use-fetch";
import {MaybeCls} from "@nutgaard/maybe-ts";

NavFrontendModal.setAppElement(document.getElementById('root'));

interface Props {
    valgtEnhet: string | undefined | null;
    contextEnhet: UseFetchHook<{ aktivEnhet: string | null }>
    onAccept(enhet: string):void;
    onDecline(enhet: string | undefined | null):void;
}

function NyEnhetContextModal(props: Props) {
    const [ pending, setPending ] = useState(false);
    const open: boolean = props.contextEnhet.data
        .map((contextEnhet) => {
            const beggeHarVerdi = !!contextEnhet.aktivEnhet && !!props.valgtEnhet;
            return beggeHarVerdi && contextEnhet.aktivEnhet !== props.valgtEnhet;
        })
        .withDefault(false);
    const onsketEnhet = props.contextEnhet.data
        .flatMap((contextEnhet) => MaybeCls.of(contextEnhet.aktivEnhet))
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
                verdi: props.valgtEnhet,
                eventType: 'NY_AKTIV_ENHET'
            })
        })
            .then(() => props.contextEnhet.refetch())
            .then(() => setPending(false))
            .then(() => props.onDecline(props.valgtEnhet))
    };

    return (
        <NavFrontendModal
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
                    Du har endret enhet i et annet vindu. Du kan ikke jobbe i 2 enheter samtidig. Velger du 'endre' mister du arbeidet du ikke har lagret.
                </AlertStripeAdvarsel>
                <Normaltekst className="blokk-s">
                    Ønsker du å endre enhet til {onsketEnhet}?
                </Normaltekst>
                <div className="decorator-context-modal__footer">
                    <Hovedknapp disabled={pending} onClick={() => props.onAccept(onsketEnhet)}>
                        Endre
                    </Hovedknapp>
                    <Knapp onClick={onDecline} type="standard" spinner={pending} autoDisableVedSpinner>
                        Behold
                    </Knapp>
                </div>
            </div>
        </NavFrontendModal>
    );
}

export default NyEnhetContextModal;