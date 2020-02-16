import React, {ChangeEventHandler} from 'react';
import visibleIf from './visibleIf';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {SagaActions, SagaActionTypes} from '../redux/actions';
import {useInitializedState} from "../hooks/use-initialized-state";
import {useEnhetContextvalueState} from "../hooks/use-contextvalue-state";

function EnhetVelger() {
    const dispatch = useDispatch<Dispatch<SagaActions>>();
    const valgtEnhet = useEnhetContextvalueState().withDefault(undefined);
    const enheter = useInitializedState((state) => state.data.saksbehandler).enheter;

    if (enheter.length === 1) {
        const enhet = enheter[0];
        return (
            <section className="dekorator-enhet">
                <h2 className="typo-avsnitt">{`${enhet.enhetId} ${enhet.navn}`}</h2>
            </section>
        );
    }

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        dispatch({type: SagaActionTypes.ENHETCHANGED, data: event.target.value});
    };
    const options = enheter.map((enhet) => (
        <option
            key={enhet.enhetId}
            value={enhet.enhetId}
        >{`${enhet.enhetId} ${enhet.navn}`}</option>
    ));

    return (
        <div className="dekorator-select-container">
            <select value={valgtEnhet} onChange={onChange}>
                {options}
            </select>
        </div>
    );
}

export default visibleIf(EnhetVelger);
