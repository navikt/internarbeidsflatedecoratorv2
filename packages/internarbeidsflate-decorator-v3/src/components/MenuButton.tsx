import React from 'react';
import { useShallow } from 'zustand/shallow';
import { Button } from '@navikt/ds-react';
import { useAppState } from '../states/AppState';
import { ChevronIcon } from './ChevronIcon';

const MenuButton: React.FC = () => {
  const [isOpen, setIsOpen] = useAppState(
    useShallow((state) => [state.open, state.setIsOpen]),
  );

  return (
    <div>
      <Button
        aria-pressed={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        icon={<ChevronIcon isOpen={isOpen} />}
        iconPosition="right"
        variant="tertiary-neutral"
        className="!dr-text-white hover:!dr-text-white hover:!dr-bg-gray-800 focus:!dr-outline-none focus:!dr-ring focus:!dr-ring-inset focus:!dr-ring-orange-500"
      >
        Meny
      </Button>
    </div>
  );
};

export default MenuButton;
