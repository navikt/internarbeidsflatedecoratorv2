<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
                version="2.0">
    <xsl:output method="html" omit-xml-declaration="yes" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/*:decoratorXMLWrapper">
        <html lang="no">
            <head>
                <meta charset="UTF-8"/>
                <title>Dekoratør for interne arbeidsflater</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </head>

            <body>
                <div id="styles">
                    <link href="/internarbeidsflatedecorator/styles.css" rel="stylesheet"/>
                </div>
                <div id="header-withmenu">
                    <div class="dekorator">
                        <div class="dekorator__hode" role="banner" id="js-dekorator-hode">
                            <div class="dekorator__container" id="js-dekorator-hode-container">
                                <header class="dekorator__banner">
                                    <h1 class="dekorator__tittel">
                                        <a href="/" class="dekorator__hode__logo" id="js-dekorator-hjem">
                                            <img src="/internarbeidsflatedecorator/svg/nav-logo.svg" class="dekorator__hode__logo__ikon" />
                                            <span class="dekorator__hode__tittel">{{applicationName}}</span>
                                        </a>
                                    </h1>

                                    <xsl:if test="visEnhet='true'">
                                        <span id="js-dekorator-enhet-navn" aria-pressed="false" class="dekorator__hode__enhet"/>
                                    </xsl:if>

                                    <xsl:if test="visSokefelt='true'">
                                        <input id="js-deokorator-sokefelt" class="dekorator__sokefelt" placeholder="Personsøk" type="search"/>
                                    </xsl:if>

                                    <xsl:if test="visVeileder='true'">
                                        <span id="js-dekorator-saksbehandler-navn" class="dekorator__hode__veileder_navn"/>
                                        <span id="js-dekorator-saksbehandler-ident" class="dekorator__hode__veileder_id"/>
                                    </xsl:if>


                                    <xsl:if test="visVarsel='true'">
                                        <button id="js-dekorator-varsel-button" class="dekorator__varselbjelle" aria-pressed="false"/>
                                        <div id="js-dekorator-varsel-tall" class="dekorator__varseltall">
                                        </div>
                                        <div id="js-dekorator-varsel-liste" class="dekorator__varselliste"
                                             aria-controlledby="js-dekorator-varsel-button">
                                            <ul id="js-dekorator-varsel-liste-elementer" class="dekorator__varselliste__elementer">
                                            </ul>
                                        </div>

                                    </xsl:if>

                                    <button aria-pressed="false" class="dekorator__hode__toggleMeny"
                                            id="js-dekorator-toggle-meny">Meny
                                    </button>
                                </header>
                            </div>
                        </div>
                        <div id="js-dekorator-nav-container" class="dekorator__nav"
                             aria-controlledby="js-dekorator-toggle-meny">
                            <nav id="js-dekorator-nav" class="dekorator__container dekorator__meny">
                                <h2>Lenker</h2>
                                <ul>
                                    <li>
                                        <a href="/moteoversikt">Mine dialogmøter</a>
                                    </li>
                                    <li>
                                        <a href="/modiabrukerdialog">Modia</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div class="dekorator__feilmelding" aria-live="polite" role="alert" id="js-dekorator-feilmelding">
                            <span class="dekorator__feilmelding__tekst" id ="js-dekorator-feilmelding-tekst"/>
                        </div>
                    </div>
                    <script src="/internarbeidsflatedecorator/js/app.min.js"/>

                    <xsl:if test="visVarsel='true'">
                        <script>document.varsel()</script>
                    </xsl:if>
                    <xsl:if test="visVeileder='true'">
                        <script>document.hentVeileder()</script>
                    </xsl:if>
                    <xsl:if test="visEnhet='true'">
                        <script>document.hentEnheter()</script>
                    </xsl:if>
                </div>
            </body>

        </html>
    </xsl:template>
</xsl:stylesheet>