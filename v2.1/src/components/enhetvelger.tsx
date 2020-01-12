import React, { ChangeEventHandler } from 'react';
import visibleIf from './visibleIf';
import { Enhet } from '../domain';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux';
import { Dispatch } from 'redux';
import { SagaActions, SagaActionTypes } from '../redux/actions';

function EnhetVelger() {
    const dispatch = useDispatch<Dispatch<SagaActions>>();
    const valgtEnhet = useSelector((state: State) => state.enhet).withDefault(undefined);
    const enheter = useSelector((state: State) => state.saksbehandler)
        .map((data) => data.enheter)
        .withDefault([] as Array<Enhet>);

    if (enheter.length === 1) {
        const enhet = enheter[0];
        return (
            <section className="dekorator-enhet">
                <h2 className="typo-avsnitt">{`${enhet.enhetId} ${enhet.navn}`}</h2>
            </section>
        );
    }

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        dispatch({ type: SagaActionTypes.ENHETCHANGED, data: event.target.value });
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
