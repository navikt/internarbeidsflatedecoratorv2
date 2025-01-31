import React, { useEffect, useRef, useState } from 'react';
import { Search } from '@navikt/ds-react';
import { useHotkeyState } from '../states/HotkeyState';
import StoreHandler from '../store/StoreHandler';
import { useAppState } from '../states/AppState';

const SearchArea: React.FC = () => {
  const fnr = StoreHandler.store((state) => state.fnr?.value);
  const showSearchArea = useAppState((state) => state.showSearchArea);
  const [input, setInput] = useState(fnr);
  const ref = useRef<HTMLInputElement>(null);

  const registerHotkey = useHotkeyState().register;

  useEffect(() => {
    registerHotkey(
      true,
      {
        key: { char: 'F3', altKey: true },
        action: () => {
          if (ref.current) ref.current.focus();
        },
        description: 'Sett fokus til søkefelt',
      },
      {
        key: { char: 'F5', altKey: true },
        action: StoreHandler.fnrValueManager.clearFnr,
        description: 'Fjern bruker',
      },
    );
  }, [registerHotkey]);

  useEffect(() => {
    setInput(fnr);
  }, [fnr]);

  if (!showSearchArea) return null;

  const onSearch = () => StoreHandler.eventHandler.changeFnr(input ?? '');

  const onClear = async () => {
    await StoreHandler.fnrValueManager.clearFnr();
    console.log('delete');
    ref.current?.focus();
  };

  return (
    <form
      data-theme="dark"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="dr:relative">
        <Search
          variant="secondary"
          ref={ref}
          aria-label="Personsøk"
          autoComplete="off"
          value={input ?? ''}
          placeholder="Personsøk"
          onChange={(value) => setInput(value)}
          label="Søk etter person med fødselsnummer/D-nummer"
          size="small"
          onClear={onClear}
        />
      </div>
    </form>
  );
};

export default SearchArea;
