import { expect, it, describe } from 'vitest';

import { erGyldigFodselsnummer } from '../fnrUtils';

const TESTFAMILIEN_AREMARK = '10108000398';
const SYNTETISK_FNR = '17912099997';
const SYNTETISK_DNR = '57912075186';

describe('fnr-utils', () => {
  it('skal godkjenne gyldig fnr', () => {
    expect(erGyldigFodselsnummer(TESTFAMILIEN_AREMARK)).toBe(true);
  });

  it('skal underkjenne ugyldig fnr', () => {
    expect(erGyldigFodselsnummer('12345678910')).toBe(false);
  });

  it('skal godkjenne gyldig syntetisk fnr', () => {
    expect(erGyldigFodselsnummer(SYNTETISK_FNR)).toBe(true);
  });

  it('skal underkjenne ugyldig syntetisk fnr', () => {
    expect(erGyldigFodselsnummer('12845678910')).toBe(false);
  });

  it('skal godkjenne gyldig syntetisk dnr', () => {
    expect(erGyldigFodselsnummer(SYNTETISK_DNR)).toBe(true);
  });

  it('skal underkjenne ugyldig syntetisk dnr', () => {
    expect(erGyldigFodselsnummer('42845678910')).toBe(false);
  });
});
