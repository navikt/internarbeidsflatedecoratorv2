import React from 'react';
import Modal from 'nav-frontend-modal';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { useDispatch } from 'react-redux';
import { useInitializedState } from '../../hooks/use-initialized-state';
import { isEnabled } from '../../internal-domain';
import { SagaActionTypes } from '../../redux/actions';

Modal.setAppElement(document.getElementById('root'));

function NyBrukerContextModal() {
    const dispatch = useDispatch();
    const fnrState = useInitializedState((state) => state.fnr);
    if (!isEnabled(fnrState)) {
        return null;
    }
    const onDecline = () => {
        dispatch({ type: SagaActionTypes.WS_FNR_DECLINE });
    };
    const onAcceptHandler = () => {
        dispatch({ type: SagaActionTypes.WS_FNR_ACCEPT });
    };

    return (
        <Modal
            className="dekorator"
            contentLabel="Brukercontext"
            isOpen={fnrState.showModal}
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
                <Normaltekst className="blokk-s">{`Ønsker du å endre bruker til ${fnrState.wsRequestedValue.withDefault(
                    'Ukjent FNR'
                )}?`}</Normaltekst>
                <div className="decorator-context-modal__footer">
                    <Hovedknapp onClick={onAcceptHandler}>Endre</Hovedknapp>
                    <Knapp type="standard" onClick={onDecline} autoDisableVedSpinner>
                        Behold
                    </Knapp>
                </div>
            </div>
        </Modal>
    );
}

export default NyBrukerContextModal;
