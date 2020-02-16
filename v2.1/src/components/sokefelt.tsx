import React, { RefObject, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../redux';
import useFieldState from '../hooks/use-field-state';
import useHotkeys, { erAltOg } from '../hooks/use-hotkeys';
import { ReduxActions, ReduxActionTypes, SagaActions, SagaActionTypes } from '../redux/actions';
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import visibleIf from "./visibleIf";

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
    const dispatch = useDispatch<Dispatch<SagaActions | ReduxActions>>();
    const maybeFnr = useSelector((state: State) => state.fnr);
    const fnr = maybeFnr.withDefault('');
    const sokefelt = useFieldState(fnr);
    const sokefeltRef = useRef<HTMLInputElement>(null);
    const visSokeIkon = !fnr || fnr !== sokefelt.input.value;

    const submit = () => {
        const value = sokefelt.input.value.trim();
        const feilmelding = lagFnrFeilmelding(value);

        dispatch({ type: ReduxActionTypes.FEILMELDING, data: feilmelding.withDefault('') });
        if (feilmelding.isNothing()) {
            dispatch({ type: SagaActionTypes.FNRSUBMIT, data: value });
        }
    };
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const reset = () => {
        dispatch({ type: SagaActionTypes.FNRRESET });
    };
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
                        onClick={() => {
                            if (sokefeltRef.current) {
                                sokefeltRef.current.focus();
                            }
                        }}
                    />
                )}
            </form>
        </section>
    );
}

export default visibleIf(Sokefelt);
