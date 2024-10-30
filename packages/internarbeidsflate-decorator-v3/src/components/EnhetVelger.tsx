import React, { ChangeEvent, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import StoreHandler from '../store/StoreHandler';
import { useAppState } from '../states/AppState';

const EnhetVelger: React.FC = () => {
  const { enheter, enhetId } = StoreHandler.store((state) => ({
    enheter: state.veileder?.enheter,
    enhetId: state.enhet.value,
  }));
  const showEnheter = useAppState((state) => state.showEnheter);

  const options: React.JSX.Element[] = useMemo(() => {
    const enhetOptions =
      enheter?.map((enhet) => (
        <option key={enhet.enhetId} value={enhet.enhetId}>
          {`${enhet.enhetId} ${enhet.navn}`}
        </option>
      )) ?? [];

    return [
      <option value="" key="velg_enhet" disabled>
        Velg enhet
      </option>,
      ...enhetOptions,
    ];
  }, [enheter]);

  const onChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (!enheter?.length) {
      throw new Error('Hadde ingen enheter når veileder prøvde å endre enhet');
    }
    const value = e.currentTarget.value;
    await StoreHandler.enhetValueManager.changeEnhetLocallyAndExternally(
      enheter,
      value,
    );
  };

  return !showEnheter ? undefined : (
    <Select
      value={enhetId ?? ''}
      label="Velg enhet"
      onChange={onChange}
      hideLabel
      className="dr-w-64"
      size="small"
    >
      {options}
    </Select>
  );
};

export default EnhetVelger;
