import { MaybeCls } from '@nutgaard/maybe-ts';
import { useInitializedState } from './use-initialized-state';
import { isEnabled } from '../internal-domain';

export function useFnrContextvalueState(): MaybeCls<string> {
    const valuestate = useInitializedState((state) => state.fnr);
    if (isEnabled(valuestate)) {
        return valuestate.value;
    }
    return MaybeCls.nothing();
}

export function useEnhetContextvalueState(): MaybeCls<string> {
    const valuestate = useInitializedState((state) => state.enhet);
    if (isEnabled(valuestate)) {
        return valuestate.value;
    }
    return MaybeCls.nothing();
}
