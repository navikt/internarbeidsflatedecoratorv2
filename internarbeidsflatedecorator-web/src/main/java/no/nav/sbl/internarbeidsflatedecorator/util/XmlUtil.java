package no.nav.sbl.internarbeidsflatedecorator.util;

import org.apache.commons.io.IOUtils;

import javax.xml.bind.JAXBException;
import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

public class XmlUtil {
    public static String xmlTilHtml(String xml, InputStream xslPath) throws JAXBException, FileNotFoundException, TransformerException {
        TransformerFactory transformerFactory = TransformerFactory.newInstance("net.sf.saxon.TransformerFactoryImpl", null);

        Source xslDoc = new StreamSource(xslPath);
        Source xmlDoc = new StreamSource(IOUtils.toInputStream(xml));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Transformer transformer = transformerFactory.newTransformer(xslDoc);
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
        transformer.transform(xmlDoc, new StreamResult(baos));

        try {
            return baos.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }
}
