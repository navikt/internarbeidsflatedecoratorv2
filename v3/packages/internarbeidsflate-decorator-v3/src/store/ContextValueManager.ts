import { Enhet } from '../types/Enhet';
import { ContextValue } from '../types/ContextValue';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

type FnrEnhet = 'enhet' | 'fnr';

export class ContextValueManager extends SubstateHandler {
  constructor(substateProps: SubstateHandlerProps) {
    super(substateProps);
  }

  protected setValue = (
    key: FnrEnhet,
    update: Partial<ContextValue<string | Enhet>>,
  ) => {
    const currentValue = { ...this.state[key] };
    const newValue = { ...currentValue, ...update };
    
    this.setState({ [key]: newValue });
  };

  protected clearWSRequestedValue = (key: FnrEnhet) => {
    this.setValue(key, { wsRequestedValue: null });
  };

  protected setWSRequestedValue = (key: FnrEnhet, value: string) => {
    this.setValue(key, { wsRequestedValue: value });
  };

  protected closeModal = (key: FnrEnhet) => {
    this.setValue(key, { showModal: false });
  };

  protected openModal = (key: FnrEnhet) => {
    this.setValue(key, { showModal: true });
  };

  protected optimisticUpdate = (key: FnrEnhet): (() => void) => {
    const currentValue = { ...this.state[key] };
    const revert = () => {
      this.setValue(key, currentValue);
    };
    return revert;
  };
}
