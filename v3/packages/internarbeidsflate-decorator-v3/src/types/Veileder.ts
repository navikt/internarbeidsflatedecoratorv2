import { Enhet } from './Enhet';

export interface Veileder {
  readonly ident: string;
  readonly fornavn: string;
  readonly etternavn: string;
  readonly navn: string;
  readonly enheter: Enhet[];
}
