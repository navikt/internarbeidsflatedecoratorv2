package no.nav.sbl.internarbeidsflatedecorator;


import no.nav.sbl.dialogarena.common.web.selftest.SelfTestBaseServlet;
import no.nav.sbl.dialogarena.types.Pingable;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletException;
import java.util.Collection;
import java.util.Collections;

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
