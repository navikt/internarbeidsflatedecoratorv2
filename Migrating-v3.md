# Migrasjonsguide fra v2.1 til v3

Selv om v3 er en fullstendig omskriving av appen, oppfører den seg stort sett likt, og har de samme
funksjonene. Hovedsakelig er det kun å endre hvor dekoratøren importeres fra, og overføre den gamle
konfigurasjonen til å passe v3.

1. Importering av dekoratøren.

   Dekoratøren lever nå på NAV sin CDN, og lasting av scripts må endres.

   ```diff
   # index.html

   -<link rel="stylesheet" href="https://internarbeidsflatedecorator.intern.dev.nav.no/v2.1/static/css/main.css" />
   -<script src="https://internarbeidsflate.intern.dev.nav.no/v2.1/static/js/head.v2.min.js"></script>

   +<link rel="stylesheet" href="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/index.css" />
   +<script src="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/bundle.js" />
   ```

   > Dekoratøren publisers på forskjellige paths i dev og prod. Bruk CDN urlen over for dev, og bytt ut
   > med `prod` i prod

   Endre deretter importering av appen med NAVSpa:

   ```diff
   -const InternflateDecorator = NAVSPA.importer<DecoratorProps>('internarbeidsflatefs');
   +const InternflateDecorator = NAVSPA.importer<DecoratorPropsV3>('internarbeidsflate-decorator-v3');
   ```

2. Konfigurasjon

   Konfigurasjonen er mye lik, men med noen få endringer.

   `fnr` og `enhet` propene er ikke lenger separert, og props objektet er flatet ut.

   ```diff
   const decoratorConfig: DecoratorProps = {
     -fnr: {
       ...
     -},
     -enhet: {
      ...
     -}
   }
   ```

   > For detaljerte typer, se README.md
   > Det anbefales å kopiere typene der inn i appen om du bruker Typescript

   | v2.1                          | v3                        | Kommentar                                                  |
   | ----------------------------- | ------------------------- | ---------------------------------------------------------- |
   | `fnr.value`                   | `fnr`                     |                                                            |
   | `fnr.display: FnrDisplay`     | `showSearchArea: boolean` |                                                            |
   | `fnr.onChange`                | `onFnrChanged`            |                                                            |
   | `enhet.value`                 | `enhet`                   |                                                            |
   | `enhet.display: EnhetDisplay` | `showEnheter: boolean`    |                                                            |
   | `enhet.onChange`              | `onEnhetChanged`          |                                                            |
   | `markup`                      | `markup`                  | Ingen endringer                                            |
   | `hotkeys`                     | `hotkeys`                 | Ingen endringer                                            |
   | `useProxy: boolean \| string` | `proxy: string`           | Legger ikke lenger på `/modiacontextholder` på proxy URLen |

   **Nye props**

   | v3                        | Kommentar                                                              |
   | ------------------------- | ---------------------------------------------------------------------- |
   | `showHotkeys: boolean`    | Vis knapp som åpner modal med liste om registrete hotkeys.             |
   | `environment`             | Hvilket miljø appen kjører i                                           |
   | `urlFormat`               | Hvilket URL format som brukes (ansatt eller intern)                    |
   | `fetchActiveUserOnMount`  | Om bruker fra context skal hentes dersom `fnr` er `undefined`          |
   | `fetchActiveEnhetOnMount` | Om enhet fra context skal hentes dersom `enhet` er `undefined`         |
   | `enableHotkeys`           | Skru på hotkeys (NB: ikke på by default)                               |
   | `includeCredentials`      | Sett `credentials: "include"` på outgoing requests til contextholderen |
