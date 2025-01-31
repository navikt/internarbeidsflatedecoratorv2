import React from 'react';
import StoreHandler from '../store/StoreHandler';
import { InternalHeader, Skeleton } from '@navikt/ds-react';

const VeilederDetails: React.FC = () => {
  const veileder = StoreHandler.store((state) => state.veileder);

  return (
    <div className="dr:w-72">
      {veileder ? (
        <>
          <InternalHeader.User
            name={veileder.navn}
            description={veileder.ident ?? EMDASH}
            className="dr:h-full"
          />
        </>
      ) : (
        <>
          <Skeleton variant="text" className="dr:bg-gray-400" width="100%" />
          <Skeleton variant="text" className="dr:bg-gray-400" width="40%" />
        </>
      )}
    </div>
  );
};

export default VeilederDetails;

const EMDASH = String.fromCharCode(8212);
