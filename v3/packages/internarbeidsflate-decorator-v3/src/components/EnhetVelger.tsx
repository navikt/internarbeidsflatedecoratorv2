import React from 'react';
import { Select } from '@navikt/ds-react';
import { ChangeEvent, useMemo } from 'react';
import StoreHandler from '../store/StoreHandler';

const EnhetVelger: React.FC = () => {
  const { enheter, enhetId } = StoreHandler.store((state) => ({
    enheter: state.veileder?.enheter,
    enhetId: state.enhet.value,
  }));

  const options = useMemo(() => {
    const res: JSX.Element[] = [];

    if (enheter?.length) {
      res.push(
        <option value="" key="velg_enheter" disabled>
          Velg enhet
        </option>,
      );

      for (const enhet of enheter) {
        res.push(
          <option
            key={enhet.enhetId}
            value={enhet.enhetId}
          >{`${enhet.enhetId} ${enhet.navn}`}</option>,
        );
      }
    }
    return res;
  }, [enheter]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!enheter) {
      throw new Error("Hadde ingen enheter når veileder prøvde å endre enhet")
    }
    const value = e.currentTarget.value;
    StoreHandler.enhetValueManager.changeEnhetLocallyAndExternally(enheter, value);
  };

  if (!options.length || enheter?.length === 1) return null;

  return (
    <>
      <Select
        aria-label="Velg enhet"
        value={enhetId ?? undefined}
        label={undefined}
        onChange={onChange}
        className="!dr-w-52 !dr-border !dr-border-solid !dr-border-gray-400 !dr-rounded-medium !dr-outline-none"
      >
        {options}
      </Select>
    </>
  );
};

export default EnhetVelger;
