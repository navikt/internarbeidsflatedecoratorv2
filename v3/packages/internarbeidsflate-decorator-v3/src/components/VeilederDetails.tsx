import React from 'react';
import StoreHandler from '../store/StoreHandler';

const VeilederDetails: React.FC = () => {
  const veileder = StoreHandler.store((state) => state.veileder);

  if (!veileder) return null;

  return (
    <div>
      <div>{veileder.ident ?? EMDASH}</div>
      <div>{veileder.navn}</div>
    </div>
  );
};

export default VeilederDetails;

const EMDASH = String.fromCharCode(8212);
