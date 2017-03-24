package no.nav.sbl.internarbeidsflatedecorator.util;

import no.nav.sbl.internarbeidsflatedecorator.domain.DecoratorXMLWrapper;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.transform.stream.StreamResult;

import java.io.StringWriter;

import static java.lang.Boolean.TRUE;
import static javax.xml.bind.JAXBContext.newInstance;
import static javax.xml.bind.Marshaller.JAXB_FORMATTED_OUTPUT;
import static javax.xml.bind.Marshaller.JAXB_FRAGMENT;

public class JAXB {


    private static final JAXBContext CONTEXT;

    static {
        try {
            CONTEXT = newInstance(
                    DecoratorXMLWrapper.class
            );
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }


    public static String marshall(Object element) {
        try {
            StringWriter writer = new StringWriter();
            Marshaller marshaller = CONTEXT.createMarshaller();
            marshaller.setProperty(JAXB_FORMATTED_OUTPUT, TRUE);
            marshaller.setProperty(JAXB_FRAGMENT, true);
            marshaller.marshal(element, new StreamResult(writer));
            return writer.toString();
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }

}
