import assert from 'assert';
import { hentVeilederNavn, hentVeilederIdent, hentEnhetNavn } from './vis-veileder';

const valgtEnhet = {id : "0333", navn: "NAV Oslo"};

const TESTVEILEDER = {
    navn: 'Testfornavn Testetternavn',
    ident: '***REMOVED***',
    enhetliste: [
        {
            id: 'id1',
            navn: 'NAV testenhet1'
        },
        {
            id: '0333',
            navn: 'NAV Oslo'
        }
    ]
};

const TESTVEILEDER_UTENNAVN = {
    ident: '***REMOVED***',
};

const TESTVEILEDER_UTENIDENT = {
    navn: 'Testfornavn Testetternavn'
};

const TESTVEILEDER_UTENENHETER = {
    navn: 'Testfornavn Testetternavn',
    ident: '***REMOVED***'
};

const TESTVEILEDER_TOMENHETLISTE = {
    navn: 'Testfornavn Testetternavn',
    ident: '***REMOVED***',
    enhetliste: []
};

const TESTVEILEDER_ENHETUTENNAVN = {
    navn: 'Testfornavn Testetternavn',
    ident: '***REMOVED***',
    enhetliste: [
        {
            id: 'id1'
        }
    ]
};

const setValgtEnhetILocation = (valgtEnhet) => {
    global.location = {search : `?valgtEnhet=${valgtEnhet.id}`};
};

const settQueriesTilIngenting = () => {
    global.location = {search : ""};
};

describe('Visning av veileders navn, ident og enhet', () => {
    before(function () {
        settQueriesTilIngenting();
    });

    describe('Vis riktig navn', () => {
        it('hentVeilederNavn skal returnere tom streng hvis navn ikke finnes', () => {
            assert.equal(hentVeilederNavn(TESTVEILEDER_UTENNAVN), '');
        });

        it('hentVeilederNavn skal returnere (forkortet) navn når navn finnes', () => {
            assert.equal(hentVeilederNavn(TESTVEILEDER), 'Testfornavn  T.');
        });
    });

    describe('Vis riktig ident', () => {
        it('hentVeilederIdent skal returnere tom streng hvis ident ikke finnes', () => {
            assert.equal(hentVeilederIdent(TESTVEILEDER_UTENIDENT), '');
        });

        it('hentVeilederIdent skal returnere ident i parentes når ident finnes', () => {
            assert.equal(hentVeilederIdent(TESTVEILEDER), '(***REMOVED***)');
        });
    });

    describe('Vis riktig enhet', () => {

        it('hentEnhetTekst skal returnere tom streng hvis enheter ikke finnes', () => {
            assert.equal(hentEnhetNavn(TESTVEILEDER_UTENENHETER), '');
        });

        it('hentEnhetTekst skal returnere tom streng hvis enheter er tom liste', () => {
            assert.equal(hentEnhetNavn(TESTVEILEDER_TOMENHETLISTE), '');
        });

        it('hentEnhetTekst skal returnere tom streng for enhet uten navn', () => {
            assert.equal(hentEnhetNavn(TESTVEILEDER_ENHETUTENNAVN), '');
        });

        it('hentEnhetTekst skal returnere første enhet hvis enhet ikke er valgt', () => {
            assert.equal(hentEnhetNavn(TESTVEILEDER), 'NAV testenhet1');
        });

        describe('når enhet er valgt i query parameter', () => {
            beforeEach(function () {
                setValgtEnhetILocation(valgtEnhet);
            });

            after(function () {
                settQueriesTilIngenting();
            });

            it('hentEnhetTekst skal returnere navn på valgt enhet', () => {
                assert.equal(hentEnhetNavn(TESTVEILEDER), valgtEnhet.navn);
            });

            it('hentEnhetTekst skal returnere første enhet hvis valgt enhet ikke er i enhetslisten til veileder', () => {
                setValgtEnhetILocation('XXXX');
                assert.equal(hentEnhetNavn(TESTVEILEDER), 'NAV testenhet1');
            });
        });

    });
});
