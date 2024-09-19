import React, { useState } from 'react';
import { useAppState } from '../states/AppState';
import HotkeyModal from './modals/HotkeyModal';
import { Button } from '@navikt/ds-react';
import { InformationIcon } from '@navikt/aksel-icons';
import { useHotkeyState } from '../states/HotkeyState';

const HotkeyMenuElement: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const visible = useAppState((state) => state.showHotkeys);
  const hotkeys = useHotkeyState((state) => state.decoratorHotkeys);

  if (!visible) return null;

  return (
    <>
      <Button
        className="hover:!dr-bg-gray-800 focus:!dr-outline-none focus:!dr-ring focus:!dr-ring-inset focus:!dr-ring-orange-500"
        title="Åpne hurtigtaster"
        onClick={() => setIsOpen(true)}
        icon={<InformationIcon aria-hidden color="white" />}
        variant="tertiary-neutral"
        color="white"
      />
      <HotkeyModal
        open={isOpen}
        close={() => setIsOpen(false)}
        hotkeys={hotkeys}
      />
    </>
  );
};

export default HotkeyMenuElement;
