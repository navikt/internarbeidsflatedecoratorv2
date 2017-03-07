import assert from 'assert';
import { hentVeilederNavn, hentVeilederIdent, hentEnhetNavn } from './vis-veileder';

const TESTVEILEDER = {
    navn: 'Testfornavn Testetternavn',
    ident: '***REMOVED***',
    enhetliste: [
        {
            id: 'id1',
            navn: 'NAV testenhet1'
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

describe('Visning av veileders navn, ident og enhet', () => {
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

        it('hentEnhetTekst skal returnere navn på enhet', () => {
            assert.equal(hentEnhetNavn(TESTVEILEDER), 'NAV testenhet1');
        });
    });
});
