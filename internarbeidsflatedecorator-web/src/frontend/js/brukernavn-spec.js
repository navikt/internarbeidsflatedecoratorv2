import assert from 'assert';
import visningsnavn from './brukernavn';

const TESTNAVN_KORT = 'Test Testesen';
const TESTNAVN_KORT_MELLOMNAVN = 'Test Tester Testes';
const TESTNAVN_LANGT_MELLOMNAVN = 'Testfornavn Testmellomnavn Testetternavn';
const TESTNAVN_FLERE_MELLOMNAVN = 'Fornavn Mellomnavn Annetmellomnavn Etternavn';
const TESTNAVN_LANGT = 'Langtfornavn Langtetternavn';

describe('Forkorting av navn', () => {
    it('Skal vise hele navnet når det er under 15 chars', () => {
        assert.equal(visningsnavn(TESTNAVN_KORT), TESTNAVN_KORT);
    });

    it('Skal forkorte mellomnavn, men beholde etternavn', () => {
        assert.equal(visningsnavn(TESTNAVN_KORT_MELLOMNAVN), 'Test T. Testes');
    });

    it('Skal forkorte både etternavn og mellomnavn', () => {
       assert.equal(visningsnavn(TESTNAVN_LANGT_MELLOMNAVN), 'Testfornavn T. T.');
    });

    it('Skal forkorte alle mellomnavn', () => {
       assert.equal(visningsnavn(TESTNAVN_FLERE_MELLOMNAVN), 'Fornavn M. A. E.');
    });

    it('Skal forkorte etternavn i langt navn uten mellomnavn', () => {
       assert.equal(visningsnavn(TESTNAVN_LANGT), 'Langtfornavn  L.');
    });
});
