import React, { ChangeEventHandler, useContext, useEffect } from 'react';
import visibleIf from './visibleIf';
import { AppContext } from '../application';
import { Enhet } from '../domain';

function EnhetVelger() {
    const context = useContext(AppContext);
    const valgtEnhet = context.enhet.withDefault(undefined);
    const enheter = context.enheter.data
        .map((data) => data.enhetliste)
        .withDefault([] as Array<Enhet>);

    useEffect(() => {
        if (!valgtEnhet && enheter.length > 0) {
            context.onEnhetChange(enheter[0].enhetId);
        }
    }, [valgtEnhet, enheter, context]);

    if (enheter.length === 1) {
        const enhet = enheter[0];
        return (
            <section className="dekorator-enhet">
                <h1 className="typo-avsnitt">{`${enhet.enhetId} ${enhet.navn}`}</h1>
            </section>
        );
    }

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        context.onEnhetChange(event.target.value);
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
