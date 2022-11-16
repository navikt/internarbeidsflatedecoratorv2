import React, { useCallback, useState } from 'react';
import HurtigtastModal from './hurtigtast-modal';
import { useDecoratorHotkeys, useHurtigtastListener } from './hurtigtaster';
import { Hotkey } from '../../domain';

interface Props {
    visible: boolean;
    hurtigtaster: Hotkey[];
}

function HurtigtastMenyElement(props: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { decoratorHotkeys } = useDecoratorHotkeys();
    const hurtigtaster = props.hurtigtaster.concat(decoratorHotkeys);

    const open = useCallback(() => setIsOpen(true), [setIsOpen]);
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);
    useHurtigtastListener(hurtigtaster);

    if (!props.visible) {
        return null;
    }

    return (
        <>
            <button className="hurtigtaster-meny-button" title="Åpne hurtigtaster" onClick={open}>
                <span className="typo-element hurtigtaster-ikon">
                    ?<span className="sr-only">Vis hurtigtaster</span>
                </span>
            </button>
            <HurtigtastModal isOpen={isOpen} close={close} hurtigtaster={hurtigtaster} />
        </>
    );
}

export default HurtigtastMenyElement;
