import React from 'react';
import Modal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import { useDispatch } from 'react-redux';
import { useInitializedState } from '../../hooks/use-initialized-state';
import { isEnabled } from '../../internal-domain';
import { SagaActionTypes } from '../../redux/actions';

Modal.setAppElement(document.getElementById('root'));

function NyEnhetContextModal() {
    const dispatch = useDispatch();
    const enhetState = useInitializedState((state) => state.enhet);
    if (!isEnabled(enhetState)) {
        return null;
    }

    const onDecline = () => {
        dispatch({ type: SagaActionTypes.WS_ENHET_DECLINE });
    };
    const onAcceptHandler = () => {
        dispatch({ type: SagaActionTypes.WS_ENHET_ACCEPT });
    };

    return (
        <Modal
            className="dekorator"
            contentLabel="Brukercontext"
            isOpen={enhetState.showModal}
            closeButton={false}
            onRequestClose={() => true}
        >
            <div className="decorator-context-modal">
                <Innholdstittel tag="h1" className="blokk-s">
                    Du har endret Enhet
                </Innholdstittel>
                <AlertStripeAdvarsel className="blokk-s">
                    Du har endret enhet i et annet vindu. Du kan ikke jobbe i 2 enheter samtidig.
                    Velger du 'endre' mister du arbeidet du ikke har lagret.
                </AlertStripeAdvarsel>
                <Normaltekst className="blokk-s">
                    Ønsker du å endre enhet til{' '}
                    {enhetState.wsRequestedValue.withDefault('Ukjent enhet')}?
                </Normaltekst>
                <div className="decorator-context-modal__footer">
                    <Hovedknapp onClick={onAcceptHandler}>Endre</Hovedknapp>
                    <Knapp onClick={onDecline} type="standard" autoDisableVedSpinner>
                        Behold
                    </Knapp>
                </div>
            </div>
        </Modal>
    );
}

export default React.memo(NyEnhetContextModal);
