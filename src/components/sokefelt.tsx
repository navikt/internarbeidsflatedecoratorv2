import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import useFieldState from '../hooks/use-field-state';
import { ReduxActions, SagaActions, SagaActionTypes } from '../redux/actions';
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import visibleIf from './visibleIf';
import { useFnrContextvalueState } from '../hooks/use-contextvalue-state';
import { fjernFeilmelding, leggTilFeilmelding } from '../redux/feilmeldinger/reducer';
import {
    FeilmeldingerActions,
    FeilmeldingKode,
    PredefiniertFeilmeldinger
} from '../redux/feilmeldinger/domain';
import { useDecoratorHotkeys } from './hurtigtaster/hurtigtaster';
import './sokefelt.css';

function Sokefelt() {
    const dispatch = useDispatch<Dispatch<SagaActions | ReduxActions | FeilmeldingerActions>>();
    const fnr = useFnrContextvalueState().withDefault('');
    const sokefelt = useFieldState(fnr);
    const sokefeltRef = useRef<HTMLInputElement>(null);
    const visSokeIkon = !fnr || fnr !== sokefelt.input.value;

    const submit = () => {
        const value = sokefelt.input.value.trim();
        const feilmelding = lagFnrFeilmelding(value);

        if (feilmelding.isJust()) {
            const feilmeldingData = feilmelding.withDefault(
                PredefiniertFeilmeldinger.FNR_UKJENT_FEIL
            );
            dispatch(leggTilFeilmelding(feilmeldingData));
        } else {
            dispatch(fjernFeilmelding(FeilmeldingKode.VALIDERING_FNR));
            dispatch(fjernFeilmelding(FeilmeldingKode.UKJENT_VALIDERING_FNR));
            dispatch({ type: SagaActionTypes.FNRSUBMIT, data: value });
        }
    };
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const reset = useCallback(() => {
        dispatch({ type: SagaActionTypes.FNRRESET });
    }, [dispatch]);
    const onReset = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        reset();
    };

    const { register } = useDecoratorHotkeys();
    useEffect(() => {
        const fokusSokefelt = () => {
            if (sokefeltRef.current) {
                sokefeltRef.current.focus();
            }
        };
        register({
            key: { char: 'F3', altKey: true },
            action: fokusSokefelt,
            description: 'Sett fokus til søkefeltet'
        });
        register({
            key: { char: 'F5', altKey: true },
            action: reset,
            description: 'Fjern bruker'
        });
    }, [sokefeltRef, reset, register]);

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
