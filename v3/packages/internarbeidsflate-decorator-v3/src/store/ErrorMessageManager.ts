import { ErrorMessage } from '../types/ErrorMessage';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

export class ErrorMessageManager extends SubstateHandler {
  constructor(substateProps: SubstateHandlerProps) {
    super(substateProps);
  }

  readonly clearAllErrorMessages = () => {
    this.setState({ errorMessages: {} });
  };

  readonly addErrorMessage = (errorMessage: ErrorMessage) => {
    const errorMessages = { ...this.state.errorMessages };
    errorMessages[errorMessage.code] = errorMessage;
    this.setState({ errorMessages });
  };

  readonly removeErrorMessage = (code: string) => {
    const errorMessages = { ...this.state.errorMessages };
    delete errorMessages[code];
    this.setState({ errorMessages });
  };
}
