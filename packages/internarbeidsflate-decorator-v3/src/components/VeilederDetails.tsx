import React from 'react';
import StoreHandler from '../store/StoreHandler';
import { BodyShort, Skeleton } from '@navikt/ds-react';

const VeilederDetails: React.FC = () => {
  const veileder = StoreHandler.store((state) => state.veileder);

  return (
    <div className="dr-min-w-72">
      {veileder ? (
        <>
          <BodyShort>{veileder.ident ?? EMDASH}</BodyShort>
          <BodyShort>{veileder.navn}</BodyShort>
        </>
      ) : (
        <>
          <BodyShort as={Skeleton} className="dr-bg-gray-400">
            Placeholder
          </BodyShort>
          <BodyShort as={Skeleton} className="dr-bg-gray-400">
            Fornavn Mellomsen Ettersen
          </BodyShort>
        </>
      )}
    </div>
  );
};

export default VeilederDetails;

const EMDASH = String.fromCharCode(8212);
