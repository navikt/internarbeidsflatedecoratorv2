import { getVeilederflatehendelserUrl, lagModiacontextholderUrl } from './api';
import { withLocation } from '../utils/test.utils';

describe('api', () => {
    describe('modiacontextholder-url', () => {
        it('skal ha riktig url ved kjøring lokalt', () => {
            withLocation('localhost', () => {
                expect(lagModiacontextholderUrl()).toBe('/modiacontextholder/api');
            });
        });

        it('skal ha riktig nais-url ved kjøring på nais-dev.intern', () => {
            withLocation('https://navn-q6.dev.intern.nav.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://modiacontextholder-q0.dev.intern.nav.no/modiacontextholder/api'
                );
            });

            withLocation('https://navn.dev.intern.nav.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://modiacontextholder-q0.dev.intern.nav.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha riktig nais-url ved kjøring på nais-preprod', () => {
            withLocation('https://navn-q6.nais.preprod.local/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://modiacontextholder-q6.dev.intern.nav.no/modiacontextholder/api'
                );
            });

            withLocation('https://navn.nais.preprod.local/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://modiacontextholder-q0.dev.intern.nav.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha riktig nais-url ved kjøring på nais-prod', () => {
            withLocation('https://navn-q.nais.adeo.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://modiacontextholder.nais.adeo.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha riktig url ved kjøring på app-XX.adeo.no', () => {
            withLocation('https://app-q6.adeo.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://app-q6.adeo.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha riktig url ved kjøring på app-XX.dev.adeo.no', () => {
            withLocation('https://app-q6.dev.adeo.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://app-q6.dev.adeo.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha riktig url ved kjøring på app.adeo.no', () => {
            withLocation('https://app.adeo.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://app.adeo.no/modiacontextholder/api'
                );
            });
        });

        it('skal ha fallback til prod om alt feiler', () => {
            withLocation('https://vg.no/contextpath', () => {
                expect(lagModiacontextholderUrl()).toBe(
                    'https://app.adeo.no/modiacontextholder/api'
                );
            });
        });
    });

    describe('getVeilederflatehendelserUrl', () => {
        it('skal ha riktig wss-url i dev.adeo.no', () => {
            withLocation('https://navn.dev.adeo.no/contextpath/', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser-q0.dev.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha riktig wss-url i app-q6.dev.adeo.no', () => {
            withLocation('https://app-q6.dev.adeo.no/contextpath/', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser-q6.dev.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha riktig nais-url ved kjøring på nais-preprod', () => {
            withLocation('https://navn-q6.nais.preprod.local/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser-q6.adeo.no/modiaeventdistribution/ws/navident'
                );
            });

            withLocation('https://navn.nais.preprod.local/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser-q0.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha riktig nais-url ved kjøring på nais-prod', () => {
            withLocation('https://navn-q.nais.adeo.no/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha riktig url ved kjøring på app-XX.adeo.no', () => {
            withLocation('https://app-q6.adeo.no/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser-q6.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha riktig url ved kjøring på app.adeo.no', () => {
            withLocation('https://app.adeo.no/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });

        it('skal ha fallback til prod om alt feiler', () => {
            withLocation('https://vg.no/contextpath', () => {
                expect(getVeilederflatehendelserUrl('navident')).toBe(
                    'wss://veilederflatehendelser.adeo.no/modiaeventdistribution/ws/navident'
                );
            });
        });
    });
});
