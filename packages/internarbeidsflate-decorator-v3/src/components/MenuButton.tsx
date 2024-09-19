import React from 'react';
import { Button } from '@navikt/ds-react';
import { useAppState } from '../states/AppState';
import { ChevronIcon } from './ChevronIcon';

const MenuButton: React.FC = () => {
  const [isOpen, setIsOpen] = useAppState((state) => [
    state.open,
    (open: boolean) => useAppState.setState({ open }),
  ]);
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
