package no.nav.sbl.internarbeidsflatedecorator.domain;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(
        name = "",
        propOrder = {"visVarsel", "visSokefelt", "visEnhet", "visSaksbehandler"}
)
@XmlRootElement(
        name = "decoratorXMLWrapper"
)
public class DecoratorXMLWrapper {

    public Boolean visVarsel;
    public Boolean visSokefelt;
    public Boolean visEnhet;
    public Boolean visSaksbehandler;

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

    public DecoratorXMLWrapper withVisSaksbehandler(Boolean visSaksbehandler) {
        this.visSaksbehandler = !(visSaksbehandler == null || !visSaksbehandler);
        return this;
    }
}
