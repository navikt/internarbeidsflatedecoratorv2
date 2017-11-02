package no.nav.sbl;

import no.nav.sbl.dialogarena.common.jetty.Jetty;

import static no.nav.sbl.dialogarena.common.jetty.Jetty.usingWar;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.*;

public class StartJetty {
    private static final int PORT = 8186;
    private static final int ssl_PORT = 8187;

    public static void main(String[] args) throws Exception {
        Jetty jetty = usingWar()
                .at("/internarbeidsflatedecorator")
                .port(PORT)
                .buildJetty();
        jetty.startAnd(first(waitFor(gotKeypress())).then(jetty.stop));
    }
}
