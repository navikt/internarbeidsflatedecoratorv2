package no.nav.sbl.mock;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import java.util.HashMap;
import java.util.Map;

import static java.util.Arrays.asList;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/veileder")
@Produces(APPLICATION_JSON)
public class MockController {
    private static final HashMap<String, Object> veileder = new HashMap<>();
    private static final HashMap<String, Object> enheter = new HashMap<>();

    static {
        veileder.put("ident", "Z999999");
        veileder.put("navn", "Fult navn");
        veileder.put("fornavn", "Fornavn");
        veileder.put("etternavn", "Etternavn");

        enheter.put("ident", veileder.get("ident"));
        enheter.put("enhetliste", asList(
                enhet("0219", "NAV Bærum"),
                enhet("0100", "NAV Østfold"),
                enhet("1234", "NAV Mocksenter")
        ));
    }

    @GET
    @Path("/enheter")
    public Response hentEnheter() {
        return Response.ok(enheter).build();
    }

    @GET
    @Path("/me")
    public Response hentVeilederInfo() {
        return Response.ok(veileder).build();
    }

    private static Map<String, String> enhet(String enhetId, String enhetNavn) {
        HashMap<String, String> enhet = new HashMap<>();
        enhet.put("enhetId", enhetId);
        enhet.put("navn", enhetNavn);
        return enhet;
    }
}
