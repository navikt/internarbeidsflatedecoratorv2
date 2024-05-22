import React from 'react';
import StoreHandler from '../store/StoreHandler';
import { BodyShort, Skeleton } from '@navikt/ds-react';

const VeilederDetails: React.FC = () => {
  const veileder = StoreHandler.store((state) => state.veileder);

  return (
    <div className="dr-w-72">
      {veileder ? (
        <>
          <BodyShort>{veileder.ident ?? EMDASH}</BodyShort>
          <BodyShort>{veileder.navn}</BodyShort>
        </>
      ) : (
        <>
          <Skeleton variant="text" className="dr-bg-gray-400" width="40%" />
          <Skeleton variant="text" className="dr-bg-gray-400" width="100%" />
        </>
      )}
    </div>
  );
};

export default VeilederDetails;

const EMDASH = String.fromCharCode(8212);
