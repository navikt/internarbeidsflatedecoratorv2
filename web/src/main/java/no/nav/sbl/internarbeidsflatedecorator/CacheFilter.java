package no.nav.sbl.internarbeidsflatedecorator;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class CacheFilter implements Filter {
    private static final int CACHE_TID_MINUTTER = 10;
    private static final int CACHE_TID_SEKUNDER = CACHE_TID_MINUTTER * 60;
    private static final String PATTERN = "EE, dd MMM yyyy HH:mm:ss zz";
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(PATTERN, Locale.ENGLISH);
    private Clock clock = Clock.systemDefaultZone();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.addHeader("Cache-control", "public, max-age=" + CACHE_TID_SEKUNDER);
        httpResponse.addHeader("Expires", convertToHeaderDate(expireDateTime()));
        chain.doFilter(request, response);
    }

    private ZonedDateTime expireDateTime() {
        return ZonedDateTime.now(clock).plusMinutes(CACHE_TID_MINUTTER);
    }

    private String convertToHeaderDate(ZonedDateTime dateTime) {
        return dateTime.format(dateTimeFormatter);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    //use for test-purposes only
    protected void setClock(Clock clock) {
        this.clock = clock;
    }
}
