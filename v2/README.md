# Dekoratør for interne arbeidsflater
Dekoratøren er en navigasjonsmeny som skal kunne brukes på tvers av fagapplikasjoner i NAV.

## Forsjell fra tidligere versjon
Den mest markante endringer fra V1 til V2, er at V2 nå har ansvar for kommunikasjon med contextholderen (modia-contextholder og modia-eventdistribution).
Dette betyr at hvis man sender inn `contextholder` i konfigurasjonen, så vil det bli satt opp en WebSocket-connection, 
og appen vil holde context i sync med hva som vises i decoratøren. 
Ved eventuelle endringer i andre flater vil det vises en bekreftelse-modal, og hvis saksbehandler bekrefter endringen så vil `onEnhetChange` eller `onSok` bli kalt. 


## Ta ibruk

Legg til følgende i index.html
```html
<script src="/internarbeidsflatedecorator/v2/static/js/head.v2.min.js"></script>
<link rel="stylesheet" href="/internarbeidsflatedecorator/v2/static/css/main.css" />
```

### React med navspa
Om man bruker react som frontendbibliotek kan man så ta ibruk `@navikt/navspa` (Eksemplet er med typescript, fjern `DecoratorProps` om det ikke brukes).
```typescript jsx
import NAVSPA from '@navikt/navspa';
import DecoratorProps from './decorator-props';
import decoratorConfig from './decorator-config';

const InternflateDecorator = NAVSPA.importer<DecoratorProps>('internarbeidsflatefs');

function App() {
    return (
        <>
            <InternflateDecorator {...decoratorConfig}/>
            <h1>Resten av appen din her.</h1>
        </>
    );
}
```

### Manuelt oppsett
Om man ikke bruker react så kan man fortsatt ta ibruk decoratoren, men man må da kalle render-funksjonen selv.
Ett eksempel på hvordan dette kan gjøres kan ses i [index.html](public/index.html).

## Konfigurasjon


```typescript jsx
interface DecoratorProps {
    appname: string;                        // Navn på applikasjon
    fnr: string | undefined | null;         // Fødselsnummer på bruker i context. NB, endring av denne medfører oppdatering av context 
    enhet: string | undefined | null;       // Enhetsnummer på enhet i context. NB, endring av denne medfører oppdatering av context
    toggles: Toggles;                       // Konfigurasjon av hvile elementer som skal vises i dekoratøren
    markup?: Markup;                        // Ekstra innhold i dekoratøren, kan brukes om man trenger å legge en knapp innenfor dekoratøren

    onSok(fnr: string): void;               // Callback-funksjon for når man skal bytte bruker (blir kalt etter bekreftelse-modal, eller ved direkte søk i søkefeltet)

    onEnhetChange(enhet: string): void;     // Callback-funksjon for når man skal bytte enhet (blir kalt etter beksreftelse-modal, eller ved direkte endring i enhets-dropdown)
    contextholder?: true | Contextholder;   // Konfigurasjn av tilkobling til contextholder. true; use default. Om man sender inn objekt så kan man overstyre url og om enhet skal generere bekreftelsemodal. Om den ikke settes vil man ikke bruke contextholder.
}

interface Toggles {
    visVeilder: boolean;
    visSokefelt: boolean;
    visEnhetVelger: boolean;
    visEnhet: boolean;
}

interface Contextholder {
    url?: string;
    promptBeforeEnhetChange?: boolean;      // Kan settes om man ikke ønsker bekreftelse-modal ved enhets-endringer
}

interface Markup {
    etterSokefelt?: string;
}

export interface Saksbehandler {
    ident: string;
    fornavn: string;
    etternavn: string;
    navn: string;
    enheter: Array<Enhet>;
}

interface Enhet {
    enhetId: string;
    navn: string;
}
```