import React, {RefObject, useCallback, useContext, useRef} from 'react';
import { AppContext } from '../application';
import useFieldState from '../hooks/use-field-state';
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import useHotkeys, {erAltOg} from "../hooks/use-hotkeys";
import {nullstillAktivBruker} from "../context-api";

function lagHotkeys(ref: RefObject<HTMLInputElement>, reset: () => void) {
    return [
        {
            matches: erAltOg('f3'),
            execute: () => {
                if (ref.current) {
                    ref.current.focus();
                }
            }
        },
        {
            matches: erAltOg('f5'),
            execute: reset
        }
    ];
}

function Sokefelt() {
    const context = useContext(AppContext);
    const fnr = context.fnr.withDefault('');
    const sokefelt = useFieldState(fnr);
    const sokefeltRef = useRef<HTMLInputElement>(null);
    const visSokeIkon = !fnr || fnr !== sokefelt.input.value;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = sokefelt.input.value.replace(/\s/g, '');
        const feilmelding = lagFnrFeilmelding(value);
        context.feilmelding.set(feilmelding);

        if (feilmelding.isNothing()) {
            context.onSok(value);
        }
    };

    const reset = useCallback(() => {
        nullstillAktivBruker().then(() => {
            sokefelt.setValue('');
            context.onSok('');
        });
    }, [sokefelt, context]);

    const onReset = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        reset();
    };

    useHotkeys(useCallback(lagHotkeys, [sokefeltRef, reset])(sokefeltRef, reset));

    return (
        <section>
            <form className="dekorator__sokefelt" onSubmit={onSubmit} onReset={onReset}>
                <label className="visuallyhidden" htmlFor="js-dekorator-sokefelt">
                    Personsøk
                </label>
                <input
                    ref={sokefeltRef}
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
