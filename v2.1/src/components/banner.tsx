import React from 'react';
import classNames from 'classnames';
import Veileder from './veileder';
import Overskrift from './overskrift';
import Enhet from './enhet';
import EnhetVelger from './enhetvelger';
import Sokefelt from './sokefelt';
import Markup from './markup';
import { WrappedState } from '../hooks/use-wrapped-state';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function Banner({ apen }: { apen: WrappedState<boolean> }) {
    const markup = useSelector((state: State) => state.markupEttersokefelt);
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
                        <Sokefelt />
                        <Markup markup={markup} />
                        <Veileder />
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
