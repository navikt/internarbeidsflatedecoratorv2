import React from 'react';
import StoreHandler from '../store/StoreHandler';

const VeilederDetails: React.FC = () => {
  const veileder = StoreHandler.store((state) => state.veileder);

  if (!veileder) return null;

  return (
    <div>
      <span>{veileder.ident ?? EMDASH}</span>
      <span className='dr-p-1'/>
      <span>{veileder.navn}</span>
    </div>
  );
};

export default VeilederDetails;

const EMDASH = String.fromCharCode(8212);
