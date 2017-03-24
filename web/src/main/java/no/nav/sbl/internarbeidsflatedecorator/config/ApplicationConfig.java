package no.nav.sbl.internarbeidsflatedecorator.config;

import no.nav.sbl.internarbeidsflatedecorator.IsAliveServlet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {

    @Bean
    public IsAliveServlet isAliveServlet() {
        return new IsAliveServlet();
    }
}
