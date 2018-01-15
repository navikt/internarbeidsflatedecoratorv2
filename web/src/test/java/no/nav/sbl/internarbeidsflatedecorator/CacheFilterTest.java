package no.nav.sbl.internarbeidsflatedecorator;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CacheFilterTest {

    @Mock
    private HttpServletRequest servletRequest;
    @Mock
    private HttpServletResponse servletResponse;
    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private CacheFilter cacheFilter;

    @Test
    public void setterCacheHeadereRiktig() throws IOException, ServletException {
        ArgumentCaptor<String> key = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> value = ArgumentCaptor.forClass(String.class);

        ZonedDateTime zonedDateTime = ZonedDateTime.of(2018, 7, 1, 12, 17, 12, 0, ZoneId.systemDefault());
        Clock fixed = Clock.fixed(zonedDateTime.toInstant(), ZoneId.systemDefault());
        cacheFilter.setClock(fixed);
        cacheFilter.doFilter(servletRequest, servletResponse, filterChain);
        verify(servletResponse, times(2)).addHeader(key.capture(), value.capture());

        List<String> keys = key.getAllValues();
        List<String> values = value.getAllValues();
        assertThat(keys.get(0)).isEqualTo("Cache-control");
        assertThat(values.get(0)).isEqualTo("public, max-age=600");
        assertThat(keys.get(1)).isEqualTo("Expires");
        assertThat(values.get(1)).isEqualTo("Sun, 01 Jul 2018 12:27:12 CEST");
    }
}
