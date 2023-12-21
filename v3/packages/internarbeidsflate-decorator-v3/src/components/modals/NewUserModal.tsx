import React from 'react';
import { Alert, Button, Heading, Modal } from '@navikt/ds-react';
import StoreHandler from '../../store/StoreHandler';

const NewUserModal: React.FC = () => {
  const fnr = StoreHandler.store((state) => state.fnr);

  return (
    <Modal
      open={fnr?.showModal}
      header={{ heading: 'Du har endret bruker i kontekst' }}
    >
      <Modal.Body>
        <Alert variant="warning">
          Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere
          samtidig. Velger du å endre bruker mister du arbeidet du ikke har
          lagret.
        </Alert>
        <Heading className="dr-mt-4" level="2" size="small">
          {`Ønsker du å endre bruker til ${
            fnr?.wsRequestedValue ?? 'ukjent fnr'
          }?`}
        </Heading>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={
            StoreHandler.fnrValueManager.changeFnrLocallyToWsRequestedValue
          }
        >
          Endre
        </Button>
        <Button
          variant="secondary"
          onClick={StoreHandler.fnrValueManager.changeFnrExternallyToLocalValue}
        >
          Behold
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewUserModal;
