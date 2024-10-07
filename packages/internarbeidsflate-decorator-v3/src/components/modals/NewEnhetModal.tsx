import React from 'react';
import { Modal, Alert, Button, Heading } from '@navikt/ds-react';
import StoreHandler from '../../store/StoreHandler';

const NewEnhetModal: React.FC = () => {
  const enhet = StoreHandler.store((state) => state.enhet);

  return (
    <Modal
      open={enhet?.showModal}
      onClose={StoreHandler.enhetValueManager.changeEnhetExternallyToLocalValue}
      header={{ heading: 'Du har endret enhet i kontekst' }}
    >
      <Modal.Body>
        <Alert variant="warning">
          Du har endret enhet i et annet vindu. Du kan ikke jobbe i 2 enheter
          samtidig. Velger du 'endre' mister du arbeidet du ikke har lagret.
        </Alert>
        <Heading
          className="dr-mt-4"
          level="2"
          size="small"
        >{`Ønsker du å endre enhet til ${enhet.wsRequestedValue}?`}</Heading>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={
            StoreHandler.enhetValueManager.changeEnhetLocallyToWsRequestedValue
          }
        >
          Endre
        </Button>
        <Button
          variant="secondary"
          onClick={
            StoreHandler.enhetValueManager.changeEnhetExternallyToLocalValue
          }
        >
          Behold
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEnhetModal;
