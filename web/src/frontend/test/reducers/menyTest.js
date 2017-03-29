import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import meny from '../../js/reducers/meny';

describe('meny', () => {

    it("har en default state", () => {
        const nextState = meny();
        expect(nextState).to.deep.equal({
            visMeny: false,
        });
    });

    it("Håndterer TOGGLE_MENY", () => {
        const initialState = deepFreeze({});
        const action = {
            type: 'TOGGLE_MENY',
        };
        const nextState = meny(initialState, action);
        expect(nextState).to.deep.equal({
            visMeny: true,
        });
    });
});