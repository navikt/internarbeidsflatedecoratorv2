import React, { useContext } from 'react';
import classNames from 'classnames';
import Veileder from './veileder';
import Overskrift from './overskrift';
import Enhet from './enhet';
import EnhetVelger from './enhetvelger';
import { AppContext } from '../application';
import Sokefelt from "./sokefelt";
import Markup from "./markup";

function Banner() {
    const context = useContext(AppContext);
    const btnCls = classNames('dekorator__hode__toggleMeny', {
        'dekorator__hode__toggleMeny--apen': context.apen.value
    });

    return (
        <div className="dekorator__hode" role="banner">
            <div className="dekorator__container">
                <header className="dekorator__banner">
                    <Overskrift />
                    <div className="flex-center">
                        <Enhet visible={context.toggles.visEnhet} />
                        <EnhetVelger visible={context.toggles.visEnhetVelger}/>
                        <Sokefelt />
                        <Markup markup={context.markupEttersokefelt}/>
                        <Veileder/>
                    </div>
                    <section>
                        <button
                            className={btnCls}
                            aria-pressed={context.apen.value}
                            onClick={() => context.apen.set(!context.apen.value)}
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
