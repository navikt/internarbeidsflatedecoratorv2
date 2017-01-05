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
                    <link href="/internarbeidsflatedecorator/styles.css?_ts=2481804614856" rel="stylesheet"/>
                </div>
                <div id="header-withmenu">
                    <div class="dekorator">
                        <div class="dekorator__hode" role="banner" id="js-dekorator-hode">
                            <div class="dekorator__container" id="js-dekorator-hode-container">
                                <header class="dekorator__banner">
                                    <h1 class="dekorator__tittel">
                                        <a href="/" class="dekorator__hode__logo" id="js-dekorator-hjem">
                                            <svg focusable="false" titleversion="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                viewBox="0 0 148.2 94.9" style="enable-background:new 0 0 148.2 94.9;" xml:space="preserve">
                                <title>NAV-logo</title>
                                <style type="text/css">
                                    .st0{fill:#FFFFFF;}
                                    .st1{fill:#231F20;}
                                </style>
                                <g>
                                    <path class="st0" d="M115.2,47.8c0,25.4-20.6,46.1-46.1,46.1C43.7,93.9,23,73.3,23,47.8C23,22.4,43.7,1.7,69.1,1.7
                                        C94.6,1.7,115.2,22.4,115.2,47.8"/>
                                    <polygon class="st0" points="0.7,67.9 10.2,44.6 19.2,44.6 9.8,67.9  "/>
                                    <polygon class="st0" points="117,67.9 126.3,44.6 131.2,44.6 121.9,67.9  "/>
                                    <polygon class="st0" points="135.3,67.9 144.6,44.6 147.2,44.6 137.9,67.9    "/>
                                    <path class="st1" d="M108.4,44.6h-8.2c0,0-0.6,0-0.8,0.5L94.9,59l-4.5-13.9c-0.2-0.5-0.8-0.5-0.8-0.5H73.9c-0.3,0-0.6,0.3-0.6,0.6
                                        V50c0-3.7-4-5.3-6.3-5.3c-5.2,0-8.7,3.4-9.8,8.7c-0.1-3.5-0.3-4.7-1.3-6c-0.4-0.6-1-1.1-1.7-1.6c-1.4-0.8-2.6-1.1-5.3-1.1h-3.1
                                        c0,0-0.6,0-0.8,0.5l0,0L42,52.2v-7c0-0.3-0.3-0.6-0.6-0.6h-7.3c0,0-0.6,0-0.8,0.5l-3,7.4c0,0-0.3,0.7,0.4,0.7h2.8v14.1
                                        c0,0.3,0.3,0.6,0.6,0.6h7.2c0.3,0,0.6-0.3,0.6-0.6V53.2h2.8c1.6,0,2,0,2.6,0.3c0.4,0.1,0.7,0.4,0.9,0.8c0.4,0.7,0.5,1.6,0.5,4.1
                                        v8.8c0,0.3,0.3,0.6,0.6,0.6h6.9c0,0,0.8,0,1.1-0.8l1.5-3.8c2,2.9,5.4,4.6,9.6,4.6h0.9c0,0,0.8,0,1.1-0.8l2.7-6.6v6.8
                                        c0,0.3,0.3,0.6,0.6,0.6h7.1c0,0,0.8,0,1.1-0.8c0,0,2.8-7,2.8-7.1h0l0,0c0.1-0.6-0.6-0.6-0.6-0.6h-2.5v-12l7.9,19.7
                                        c0.3,0.8,1.1,0.8,1.1,0.8h8.3c0,0,0.8,0,1.1-0.8l8.8-21.8C109.3,44.6,108.4,44.6,108.4,44.6z M73.3,59.5h-4.7
                                        c-1.9,0-3.4-1.5-3.4-3.4c0-1.9,1.5-3.4,3.4-3.4h1.3c1.9,0,3.4,1.5,3.4,3.4V59.5z"/>
                                </g>
                            </svg>
                                            <span class="dekorator__hode__tittel">{{applicationName}}</span>
                                        </a>
                                    </h1>
                                    <xsl:if test="visSokefelt='true'">
                                        <p>Søkefelt lissom</p>
                                    </xsl:if>

                                    <xsl:if test="visVarsel='true'">
                                        <button id="js-dekorator-varsel-button" class="dekorator__varselbjelle" aria-pressed="false"/>
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
                    </div>
                    <script src="/internarbeidsflatedecorator/init.js?_ts=2481804612826"/>

                    <xsl:if test="visVarsel='true'">
                        <script src="/internarbeidsflatedecorator/varsel.js?_ts=2481804612836"/>
                    </xsl:if>
                </div>
            </body>

        </html>
    </xsl:template>
</xsl:stylesheet>