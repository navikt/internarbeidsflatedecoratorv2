import React from 'react';
import { PropsWithChildren, useMemo } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import StoreHandler from '../store/StoreHandler';
import { Button } from '@navikt/ds-react';

const ErrorMessageDisplay: React.FC<{ errorMessages: ErrorMessage[] }> = ({
  errorMessages,
}) => {
  if (errorMessages.length === 1) {
    const firstMessage = errorMessages[0];
    return (
      <ErrorMessageContainer>
        {`${firstMessage.code}: ${firstMessage.message}`}
        <Button
          variant="tertiary-neutral"
          size='small'
          className='dr-ml-2 dr-text-white hover:dr-text-white hover:dr-bg-red-700 focus:dr-outline-none focus:dr-ring focus:dr-ring-white active:!dr-bg-red-600'
          onClick={() =>
            StoreHandler.errorManager.removeErrorMessage(firstMessage.code)
          }
        >
          Fjern
        </Button>
      </ErrorMessageContainer >
    );
  }

  return (
    <ErrorMessageContainer>
      Det oppstod flere feil;{' '}
      {errorMessages.map((message) => (
        <span key={message.code}>
          <abbr title={message.message}>{message.code}</abbr>{' '}
        </span>
      ))}
      <button
        onClick={() =>
          StoreHandler.errorManager.removeErrorMessage(errorMessages[0].code)
        }
      >
        Fjern
      </button>
    </ErrorMessageContainer>
  );
};

const ErrorMessageWrapper: React.FC = () => {
  const messagesObject = StoreHandler.store((state) => state.errorMessages);

  const messages = useMemo(() => {
    return Object.values(messagesObject).sort((a, b) =>
      a.code.localeCompare(b.code),
    );
  }, [messagesObject]);

  const open = messages.length;

  return (
    <div
      aria-hidden={!open}
      className={`dr-duration-1000 dr-transition-height ${open ? 'dr-h-auto' : 'dr-h-0'}`}
    >
      {open ? <ErrorMessageDisplay errorMessages={messages} /> : null}
    </div>
  );
};

const ErrorMessageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="dr-p-4 dr-bg-red-600 dr-text-center dr-block dr-text-white dr-italic"
      aria-live="assertive"
      role="alert"
    >
      {children}
    </div>
  );
};

export default ErrorMessageWrapper;
