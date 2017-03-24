package no.nav.sbl.internarbeidsflatedecorator;


import no.nav.sbl.dialogarena.common.web.selftest.SelfTestJsonBaseServlet;
import no.nav.sbl.dialogarena.types.Pingable;

import java.util.Collection;

import static java.util.Collections.emptyList;

public class SelftestJsonServlet extends SelfTestJsonBaseServlet {

    @Override
    protected Collection<? extends Pingable> getPingables() {
        return emptyList();
    }
}
