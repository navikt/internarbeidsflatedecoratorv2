import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField } from '@navikt/ds-react';
import { MagnifyingGlassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useHotkeyState } from '../states/HotkeyState';
import StoreHandler from '../store/StoreHandler';
import { useAppState } from '../states/AppState';

const SearchArea: React.FC = () => {
  const fnr = StoreHandler.store((state) => state.fnr?.value ?? '');
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

  const showSearchIcon = !fnr || fnr !== input;

  const searchConfig: Config = {
    icon: <MagnifyingGlassIcon />,
    label: 'Søk',
    onClick: () => StoreHandler.eventHandler.changeFnr(input),
  };

  const clearConfig: Config = {
    icon: <XMarkIcon />,
    label: 'Resett',
    onClick: StoreHandler.fnrValueManager.clearFnr,
  };

  const config = showSearchIcon ? searchConfig : clearConfig;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        config.onClick();
      }}
    >
      <div className="dr-relative">
        <TextField
          ref={ref}
          className="!dr-border !dr-border-solid !dr-border-gray-400 !dr-rounded-medium"
          aria-label="Personsøk"
          type="text"
          autoComplete="off"
          value={input}
          placeholder="Personsøk"
          onChange={(e) => setInput(e.currentTarget.value)}
          label={undefined}
        />
        <Button
          className="!dr-absolute !dr-top-0 !dr-bottom-0 !dr-right-0 !dr-m-[1px] focus:!dr-outline-none focus:!dr-ring focus:!dr-ring-orange-500 !dr-text-white hover:!dr-text-white hover:!dr-bg-gray-600"
          icon={config.icon}
          variant="tertiary-neutral"
          aria-label={config.label}
        />
      </div>
    </form>
  );
};

export default SearchArea;

interface Config {
  icon: React.JSX.Element;
  label: string;
  onClick: () => void;
}
