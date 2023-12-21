import { ErrorMessage, PredefiniertFeilmeldinger } from '../types/ErrorMessage';

const kontrollRekke1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const kontrollRekke2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

const decimalRadix = 10;

function isLegalPNumber(day: number, month: number) {
  return day > 0 && day < 32 && month > 0 && month < 13;
}

function isLegalDNumber(day: number, month: number) {
  return day > 40 && day < 72 && month > 0 && month < 13;
}

function isLegalHNumber(day: number, month: number) {
  return day > 0 && day < 32 && month > 40 && month < 53;
}

function isLegalBNumber(day: number, month: number) {
  return day > 0 && day < 32 && month > 20 && month < 33;
}

function isLegalSyntheticNumber(day: number, month: number) {
  if (month <= 80) {
    return false;
  }
  return isLegalVariant(day, month - 80);
}

function isLegalVariant(day: number, month: number): boolean {
  return (
    isLegalPNumber(day, month) ||
    isLegalDNumber(day, month) ||
    isLegalHNumber(day, month) ||
    isLegalBNumber(day, month) ||
    isLegalSyntheticNumber(day, month)
  );
}

function isLegalBirthday(fnr: string) {
  const day = parseInt(fnr.substring(0, 2), decimalRadix);
  const month = parseInt(fnr.substring(2, 4), decimalRadix);

  return isLegalVariant(day, month);
}

function fetchControlNumbers(fnr: number[], controlNumbers: number[]) {
  let sum = 0;
  for (let sifferNummer = 0; sifferNummer < fnr.length; sifferNummer++) {
    sum += fnr[sifferNummer] * controlNumbers[sifferNummer];
  }
  const kontrollSiffer = sum % 11;
  return kontrollSiffer !== 0 ? 11 - kontrollSiffer : 0;
}

export function erGyldigFodselsnummer(fnr: string): boolean {
  if (fnr.length !== 11) {
    return false;
  }
  if (!isLegalBirthday(fnr.substring(0, 6))) {
    return false;
  }
  const fodselsnummerListe = fnr
    .split('')
    .map((x) => parseInt(x, decimalRadix));
  const kontrollSiffer1 = fetchControlNumbers(
    fodselsnummerListe.slice(0, 9),
    kontrollRekke1,
  );
  const kontrollSiffer2 = fetchControlNumbers(
    fodselsnummerListe.slice(0, 10),
    kontrollRekke2,
  );
  return (
    fodselsnummerListe[9] === kontrollSiffer1 &&
    fodselsnummerListe[10] === kontrollSiffer2
  );
}

const isOnlyNumbers = (fnr: string) => fnr.match(/^\d+$/);
const isCorrectLength = (fnr: string) => fnr.length === 11;

export const makeFnrFeilmelding = (fnr: string): ErrorMessage | undefined => {
  if (!isOnlyNumbers(fnr)) {
    return PredefiniertFeilmeldinger.FNR_KUN_TALL;
  }
  if (!isCorrectLength(fnr)) {
    return PredefiniertFeilmeldinger.FNR_11_SIFFER;
  }
  if (!erGyldigFodselsnummer(fnr)) {
    return PredefiniertFeilmeldinger.FNR_KONTROLL_SIFFER;
  }
  return undefined;
};
