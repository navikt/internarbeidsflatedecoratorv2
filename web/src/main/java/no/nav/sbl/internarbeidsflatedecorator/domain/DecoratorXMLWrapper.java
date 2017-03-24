package no.nav.sbl.internarbeidsflatedecorator.domain;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(
        name = "",
        propOrder = {"visVarsel", "visSokefelt", "visEnhet", "visVeileder"}
)
@XmlRootElement(
        name = "decoratorXMLWrapper"
)
public class DecoratorXMLWrapper {

    public Boolean visVarsel;
    public Boolean visSokefelt;
    public Boolean visEnhet;
    public Boolean visVeileder;

    public DecoratorXMLWrapper withVisVarsel(Boolean visVarsel) {
        this.visVarsel = !(visVarsel == null || !visVarsel);
        return this;
    }

    public DecoratorXMLWrapper withVisSokefelt(Boolean visSokefelt) {
        this.visSokefelt = !(visSokefelt == null || !visSokefelt);
        return this;
    }

    public DecoratorXMLWrapper withVisEnhet(Boolean visEnhet) {
        this.visEnhet = !(visEnhet== null || !visEnhet);
        return this;
    }

    public DecoratorXMLWrapper withVisVeileder(Boolean visVeileder) {
        this.visVeileder = !(visVeileder == null || !visVeileder);
        return this;
    }
}
