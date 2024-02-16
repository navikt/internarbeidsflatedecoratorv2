import React from 'react';
import { InternalHotkey } from '../../types/Hotkey';
import { Modal, Table } from '@navikt/ds-react';

interface Props {
  hotkeys: InternalHotkey[];
  open: boolean;
  close: () => void;
}

const HotkeyModal: React.FC<Props> = ({ hotkeys, open, close }) => {
  return (
    <Modal
      open={open}
      onClose={close}
      header={{ heading: 'Hurtigtaster', closeButton: true }}
    >
      <Modal.Body>
        {hotkeys.length === 0 ? (
          <div>Ingen hurtigtaster er registrert</div>
        ) : (
          <div>
            <Table className="!dr-min-w-[350px]">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Tast</Table.HeaderCell>
                  <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {hotkeys.map((hotkey) => (
                  <Table.Row key={hotkey.id}>
                    <Table.DataCell scope="row">{hotkey.id}</Table.DataCell>
                    <Table.DataCell>{hotkey.description}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default HotkeyModal;
