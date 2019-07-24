import React, { useContext } from 'react';
import { AppContext } from '../application';
import useFieldState from '../hooks/use-field-state';
import { lagFnrFeilmelding } from '../utils/fnr-utils';

function Sokefelt() {
    const context = useContext(AppContext);
    const fnr = context.fnr.withDefault('');
    const sokefelt = useFieldState(fnr);
    const visSokeIkon = !fnr || fnr !== sokefelt.input.value;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = sokefelt.input.value.replace(/\s/g, '');
        context.feilmelding.set(lagFnrFeilmelding(value));

        if (context.feilmelding.value.isNothing()) {
            context.onSok(value);
        }
    };

    const onReset = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sokefelt.setValue('');
        context.onSok('');
    };

    return (
        <section>
            <form className="dekorator__sokefelt" onSubmit={onSubmit} onReset={onReset}>
                <label className="visuallyhidden" htmlFor="js-dekorator-sokefelt">
                    Personsøk
                </label>
                <input
                    className="dekorator__sokefelt__input"
                    id="js-dekorator-sokefelt"
                    placeholder="Personsøk"
                    type="search"
                    autoComplete="off"
                    {...sokefelt.input}
                />
                {visSokeIkon && (
                    <input
                        id="forstorrelsesglass_sokefelt"
                        type="submit"
                        value="Søk"
                        className="dekorator__sokefelt__ikon dekorator__forstorrelsesglass--hvit"
                    />
                )}
                {!visSokeIkon && (
                    <input
                        id="forstorrelsesglass_sokefelt"
                        type="reset"
                        value="reset"
                        className="dekorator__sokefelt__ikon dekorator__kryss--hvit"
                    />
                )}
            </form>
        </section>
    );
}

export default Sokefelt;
