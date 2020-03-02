import React from 'react';
import classNames from 'classnames';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { useSelector } from 'react-redux';
import Veileder from './veileder';
import Overskrift from './overskrift';
import Enhet from './enhet';
import EnhetVelger from './enhetvelger';
import Sokefelt from './sokefelt';
import Markup from './markup';
import { WrappedState } from '../hooks/use-wrapped-state';
import { useInitializedState } from '../hooks/use-initialized-state';
import { State } from '../redux/reducer';
import { EnhetDisplay } from '../domain';
import { isEnabled } from '../internal-domain';

interface Props {
    appname: string;
    apen: WrappedState<boolean>;
}

function BannerContent() {
    const maybeMarkup = useInitializedState((state) => MaybeCls.of(state.markup));
    const ettersokefeltet = maybeMarkup
        .flatMap((markup) => MaybeCls.of(markup.etterSokefelt))
        .withDefault(undefined);
    const toggles = useInitializedState((state) => state.toggles);
    const enhetConfig = useInitializedState((state) => state.enhet);
    const visEnhet = isEnabled(enhetConfig) && enhetConfig.display === EnhetDisplay.ENHET;
    const visEnhetVelger =
        isEnabled(enhetConfig) && enhetConfig.display === EnhetDisplay.ENHET_VALG;

    const fnrConfig = useInitializedState((state) => state.fnr);
    const visSokefelt = isEnabled(fnrConfig);

    return (
        <>
            <Enhet visible={visEnhet} />
            <EnhetVelger visible={visEnhetVelger} />
            <Sokefelt visible={visSokefelt} />
            <Markup markup={ettersokefeltet} />
            <Veileder visible={toggles.visVeileder} />
        </>
    );
}

function Banner(props: Props) {
    const { apen } = props;
    const isInitialized = useSelector((state: State) => state.initialized);
    const btnCls = classNames('dekorator__hode__toggleMeny', {
        'dekorator__hode__toggleMeny--apen': apen.value
    });

    return (
        <div className="dekorator__hode" role="banner">
            <div className="dekorator__container">
                <header className="dekorator__banner">
                    <Overskrift appname={props.appname} />
                    <div className="flex-center">{isInitialized && <BannerContent />}</div>
                    <section className="dekorator__hode__toggleMeny_wrapper">
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
