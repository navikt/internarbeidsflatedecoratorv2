import { sjekkStatuskode, toJson } from './rest-utils';
import { expect } from 'chai';
import assert from 'assert';

describe('rest-utils', () => {
    describe('sjekkStatuskode', () => {
        it('skal returnere responsen ved status 200', () => {
            const response = {status: 200, data: '123'};
            assert.equal(sjekkStatuskode(response), response);
        });

        it('skal kaste feil ved status 401', () => {
            const response = {status: 401, data: '123', statusText: 'feilfeil'};
            expect(() => sjekkStatuskode(response)).to.throw(Error, 'feilfeil');
        });
    });

    describe('toJson', () => {
        it('Skal returnere responsen ved no-content', () => {
            const response = {status: 204, data: ''};
            assert.equal(toJson(response), response);
        });
    });
});

