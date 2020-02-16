import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {MaybeCls} from "@nutgaard/maybe-ts";
import { State } from '../redux';
import Veileder from './veileder';
import Overskrift from './overskrift';
import Enhet from './enhet';
import EnhetVelger from './enhetvelger';
import Sokefelt from './sokefelt';
import Markup from './markup';
import { WrappedState } from '../hooks/use-wrapped-state';

interface Props {
    apen: WrappedState<boolean>;
}

function Banner(props: Props) {
    const { apen } = props;
    const maybeMarkup = useSelector((state: State) => MaybeCls.of(state.markup));
    const ettersokefeltet = maybeMarkup
        .flatMap((markup) => MaybeCls.of(markup.etterSokefelt))
        .withDefault(undefined);
    const toggles = useSelector((state: State) => state.toggles);
    const btnCls = classNames('dekorator__hode__toggleMeny', {
        'dekorator__hode__toggleMeny--apen': apen.value
    });

    return (
        <div className="dekorator__hode" role="banner">
            <div className="dekorator__container">
                <header className="dekorator__banner">
                    <Overskrift />
                    <div className="flex-center">
                        <Enhet visible={toggles.visEnhet} />
                        <EnhetVelger visible={toggles.visEnhetVelger} />
                        <Sokefelt visible={toggles.visSokefelt} />
                        <Markup markup={ettersokefeltet} />
                        <Veileder visible={toggles.visVeileder}/>
                    </div>
                    <section>
                        <button
                            className={btnCls}
                            aria-pressed={apen.value}
                            onClick={() => apen.set(!apen.value)}
                        >
                            Meny
                        </button>
                    </section>
                </header>
            </div>
        </div>
    );
}

export default Banner;
