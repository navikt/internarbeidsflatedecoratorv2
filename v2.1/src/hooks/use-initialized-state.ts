import { useSelector } from 'react-redux';
import { InitializedState, isInitialized } from '../redux/reducer';
import { State } from '../redux';

export function useInitializedState<T>(selector: (state: InitializedState) => T): T {
    const state = useSelector((state: State) => state.appdata);
    if (isInitialized(state)) {
        return selector(state);
    }
    throw new Error('Could not get data from state since it is not initialized yet.');
}
