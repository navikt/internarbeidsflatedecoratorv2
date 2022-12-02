import React from 'react';
import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import { describe } from './hurtigtaster';
import { Hotkey } from '../../domain';

Modal.setAppElement(document.getElementById('root'));

interface Props {
    isOpen: boolean;
    close(): void;
    hurtigtaster: Hotkey[];
}

function HurtigtastModal(props: Props) {
    const rader = props.hurtigtaster.map(({ key, description }) => {
        const keyDescription = describe(key);
        return (
            <tr key={keyDescription}>
                <td>{keyDescription}</td>
                <td>{description}</td>
            </tr>
        );
    });
    return (
        <Modal
            portalClassName="dekorator"
            contentLabel=""
            isOpen={props.isOpen}
            onRequestClose={props.close}
        >
            <div className="hurtigtaster-modal">
                <Innholdstittel tag="h1" className="blokk-s">
                    Hurtigtaster
                </Innholdstittel>
                <div className="hurtigtaster-tabell-outline typo-normal">
                    <table className="hurtigtaster-tabell">
                        <thead>
                            <tr>
                                <th>Tast</th>
                                <th>Beskrivelse</th>
                            </tr>
                        </thead>
                        <tbody>{rader}</tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}

export default HurtigtastModal;
