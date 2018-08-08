import { expect } from 'chai';

import { hentValgtEnhetIDFraURL } from '../../js/utils/url-utils';

describe('url-utils', () => {
    describe('hentValgtEnhetIDFraURL', () => {

        it('skal hente enhetID fra query-parametere', () => {
            global.location = {
                search: '?enhet=0444'
            };
            const enhetId = hentValgtEnhetIDFraURL();
            expect(enhetId).to.equal('0444');
        });

        it('skal returnere undefined om ingen enhet er valgt', () => {
            global.location = {
                search: ''
            };
            const enhetId = hentValgtEnhetIDFraURL();
            expect(enhetId).to.be.undefined;
        });
    });
});
