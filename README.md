# Dekoratør for interne arbeidsflater
Dekoratøren er en navigasjonsmeny som skal kunne brukes på tvers av fagapplikasjoner i NAV.
Appen fremstår utad som en enkeltstående JS-fil som skal kunne bygge seg selv uavhengig av klientens teknologi, 
og style seg selv uten at det påvirker applikasjonen den ligger i.

Kjørbart eksempel: https://navikt.github.io/internarbeidsflatedecorator/

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
                    visVeileder: true
                },
                fnr: '12345678901',
                applicationName: 'Applikasjonsnavn',
            }
        }
    ```
    - Kall window.renderDecoratorHead(config) for å bygge hodet.
        
### Utvikling

```
npm install
npm run dev
```

Høyreklikk på index.html og ta "Open in browser".

```
npm install
npm run dev
```

### Deploy

```
npm install
npm run start
```
