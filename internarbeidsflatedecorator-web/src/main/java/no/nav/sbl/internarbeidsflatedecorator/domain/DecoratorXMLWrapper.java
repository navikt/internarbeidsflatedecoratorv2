package no.nav.sbl.internarbeidsflatedecorator.domain;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(
        name = "",
        propOrder = {"visVarsel", "visSokefelt"}
)
@XmlRootElement(
        name = "decoratorXMLWrapper"
)
public class DecoratorXMLWrapper {

    public Boolean visVarsel;
    public Boolean visSokefelt;

    public DecoratorXMLWrapper withVisVarsel(Boolean visVarsel) {
        this.visVarsel = !(visVarsel == null || !visVarsel);
        return this;
    }

    public DecoratorXMLWrapper withVisSokefelt(Boolean visSokefelt) {
        this.visSokefelt = !(visSokefelt == null || !visSokefelt);
        return this;
    }
}
