# Dekoratør for interne arbeidsflater
Denne løsningen finnes i to versjoner, over REST og som enkeltstående JS-fil. REST-tjenesten skal fases ut når alle konsumenter er over på enkeltstående JS-fil. 


## JS-fil
Enkeltstående JS-fil som skal kunne bygge seg selv uavhengig av konsumenten sin teknologi, og style seg selv uten at det påvirker applikasjonen den ligger i.

### Ta i bruk
    - Legg til en <div id="header"></div> der du ønsker at headern skal plasseres. 
    - importer js-filen som ligger på /internarbeidsflatedecorator/js/head.min.js
    - Bygg opp et config-objekt som ser ca. slik ut: 
    ```
    var config = {
        config: {
                toggles: {
                    visEnhet: true,
                    visSokefelt: true,
                    visSaksbehandler: true
                },
                fnr: '12345678901',
                applicationName: 'Applikasjonsnavn',
            }
        }
    ```
    - Kall window.renderDecoratorHead(config) for å bygge hodet.
        
### Utvikling

```
cd web/src/frontend
npm install
npm run dev
```

Høyreklikk på index.html og ta "Open in browser".


## REST-endepunkt
Her kan man legge til følgende URL-parametere for å styre innholdet i hodet: 
    - visSaksbehandler
    - visEnhet
    - visSokefelt
    
Denne løsningen brukes typisk av et DecoratorFilter fra Innholdshenteren (http://stash.devillo.no/projects/FELLES/repos/innholdshenter/browse)
til å server-side hente HTML'en og legge dette rundt responsen.

### Utvikling

Kjør igang StartJetty. Gå på localhost:8186/internarbeidsflatedecorator/rest/decorator og legg til evt. URL-parametre

```
cd web/src/frontend
npm install
npm run dev
```

### Deploy

```
cd web/src/frontend
npm install
npm run start
```
