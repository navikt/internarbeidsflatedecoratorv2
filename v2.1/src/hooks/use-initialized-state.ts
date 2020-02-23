import {useSelector} from "react-redux";
import {InitializedState, isInitialized, State} from "../redux/reducer";

export function useInitializedState<T>(selector: (state: InitializedState) => T): T {
    const state = useSelector((state: State) => state);
    if (isInitialized(state)) {
        return selector(state)
    }
    throw new Error('Could not get data from state since it is not initialized yet.');
}
