package no.nav.sbl.internarbeidsflatedecorator.rest;

import no.nav.sbl.internarbeidsflatedecorator.domain.DecoratorXMLWrapper;
import org.springframework.stereotype.Controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.xml.bind.JAXBException;
import javax.xml.transform.TransformerException;

import java.io.FileNotFoundException;

import static javax.ws.rs.core.MediaType.TEXT_HTML;
import static no.nav.sbl.internarbeidsflatedecorator.util.JAXB.marshall;
import static no.nav.sbl.internarbeidsflatedecorator.util.XmlUtil.xmlTilHtml;

@Controller
@Path("/decorator")
public class DecoratorRessurs {

    @GET
    @Produces(TEXT_HTML)
    //kaster exceptionsene uten å håndtere noe mer. Ingen av disse skal kunne skje med mindre noe er virkelig galt.
    public String hentDekorator(@QueryParam("visVarsel") Boolean visVarsel, @QueryParam("visSokefelt") Boolean visSokefelt,
                                @QueryParam("visEnhet") Boolean visEnhet) throws FileNotFoundException, JAXBException, TransformerException {
        DecoratorXMLWrapper decoratorXMLWrapper = new DecoratorXMLWrapper()
                .withVisSokefelt(visSokefelt)
                .withVisVarsel(visVarsel)
                .withVisEnhet(visEnhet);
        return xmlTilHtml(marshall(decoratorXMLWrapper), this.getClass().getClassLoader().getResourceAsStream("decorator.xsl"));
    }

}
