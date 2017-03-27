package no.nav.sbl.internarbeidsflatedecorator;


import no.nav.sbl.dialogarena.common.web.selftest.SelfTestBaseServlet;
import no.nav.sbl.dialogarena.types.Pingable;
import java.util.Collection;

import static java.util.Collections.emptyList;

public class SelftestServlet extends SelfTestBaseServlet{
    private static final String APPLIKASJONS_NAVN = "internarbeidsflatedecorator";
    @Override
    protected String getApplicationName() {
        return APPLIKASJONS_NAVN;
    }

    @Override
    protected Collection<? extends Pingable> getPingables() {
        return emptyList();
    }
}
