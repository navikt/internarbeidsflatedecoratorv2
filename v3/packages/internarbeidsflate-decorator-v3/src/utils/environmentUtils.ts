export type Environment = 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'prod' | 'local';

export type UrlFormat = 'LOCAL' | 'ADEO' | 'NAV_NO';
// LOCAL = localhost, github pages etc
// ADEO = app.adeo.no
// NAV_NO = intern.nav.no / intern.dev.nav.no


export enum EnvClass {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export interface UrlEnvironment {
  environment: Environment;
  envClass: EnvClass;
  urlFormat: UrlFormat;
}

