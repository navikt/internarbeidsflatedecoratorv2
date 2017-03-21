import assert from 'assert';

import { lagFodselsnummerfeilmelding } from './personsok';

const GYLDIG_FODT_I_2039 = '***REMOVED***';
const GYLDIG_FODT_I_2013 = '***REMOVED***';
const GYLDIG_FODT_I_1930 = '***REMOVED***';
const GYLDIG_FODT_I_1854 = '***REMOVED***';

const GYLDIG_D_NUMMER_FODT_I_2039 = '68023999882';
const GYLDIG_H_NUMMER_FODT_I_1930 = '15483002812';

const TI_SIFFER = GYLDIG_FODT_I_1854.substring(0, 10);
const TOLV_SIFFER = `${GYLDIG_FODT_I_1854}0`;
const MED_BOKSTAV = '***REMOVED***0019';
const MODULOGYLDIG_MED_UGYLDIG_DATO = '00000000000';

describe('Validering av fodselsnummer', () => {
   describe('for person født i 2039 med gyldig fødselsnummer', () => {
       it('burde validere', () => {
           assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_FODT_I_2039));
       })
   });
    describe('for person født i 2013 med gyldig fødselsnummer', () => {
        it('burde validere', () => {
            assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_FODT_I_2013));
        })
    });
    describe('for person født i 1930 med gyldig fødselsnummer', () => {
        it('burde validere', () => {
            assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_FODT_I_1930));
        })
    });
    describe('for person født i 1854 med gyldig fødselsnummer', () => {
        it('burde validere', () => {
            assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_FODT_I_1854));
        })
    });
    describe('med 10 siffer', () => {
        it('burde ikke validere', () => {
            assert.equal(true, lagFodselsnummerfeilmelding(TI_SIFFER) !== null);
        })
    });
    describe('med 12 siffer', () => {
        it('burde ikke validere', () => {
            assert.equal(true, lagFodselsnummerfeilmelding(TOLV_SIFFER) !== null);
        })
    });
    describe('som inneholder bokstaver', () => {
        it('burde ikke validere', () => {
            assert.equal(true, lagFodselsnummerfeilmelding(MED_BOKSTAV) !== null);
        })
    });
    describe('som er modulo-gyldig, men ikke er en gyldig dato', () => {
        it('burde ikke validere', () => {
            assert.equal(true, lagFodselsnummerfeilmelding(MODULOGYLDIG_MED_UGYLDIG_DATO) !== null);
        })
    });
    describe('for person født i 2039 med gyldig D-nummer', () => {
        it('burde validere', () => {
            assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_D_NUMMER_FODT_I_2039));
        })
    });
    describe('for person født i 1930 med gyldig H-nummer', () => {
        it('burde validere', () => {
            assert.equal(null, lagFodselsnummerfeilmelding(GYLDIG_H_NUMMER_FODT_I_1930));
        })
    });
});