import { withLocation } from '../utils/test.utils';
import { gosysUrl } from './lenker';

describe('lenker', () => {
    const fnr = '12345678910';

    describe('gosys', () => {
        it('preprod uten bruker i kontekst', () => {
            withLocation('https://app-q0.adeo.no/modia', () => {
                expect(gosysUrl('', '/gosys/personoversikt/fnr=')).toBe(
                    'https://gosys-q0.dev.intern.nav.no/gosys/'
                );
            });
            withLocation('https://app-q1.adeo.no/modia', () => {
                expect(gosysUrl('', '/gosys/personoversikt/fnr=')).toBe(
                    'https://gosys-q1.dev.intern.nav.no/gosys/'
                );
            });
        });

        it('preprod med bruker i kontekst', () => {
            withLocation('https://app-q0.adeo.no/modia', () => {
                expect(gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)).toBe(
                    'https://gosys-q0.dev.intern.nav.no/gosys/personoversikt/fnr=12345678910'
                );
            });
            withLocation('https://app-q1.adeo.no/modia', () => {
                expect(gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)).toBe(
                    'https://gosys-q1.dev.intern.nav.no/gosys/personoversikt/fnr=12345678910'
                );
            });
        });

        it('prod uten bruker i kontekst', () => {
            withLocation('https://app.adeo.no/modia', () => {
                expect(gosysUrl('', '/gosys/personoversikt/fnr=')).toBe(
                    'https://gosys.intern.nav.no/gosys/'
                );
            });
        });

        it('prod med bruker i kontekst', () => {
            withLocation('https://app.adeo.no/modia', () => {
                expect(gosysUrl(fnr, `/gosys/personoversikt/fnr=${fnr}`)).toBe(
                    'https://gosys.intern.nav.no/gosys/personoversikt/fnr=12345678910'
                );
            });
        });
    });
});
