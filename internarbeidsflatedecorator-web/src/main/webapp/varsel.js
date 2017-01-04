window.onload = function () {
    var varsler =  JSON.parse(getVarsler());
    var varselbjelle = document.getElementById("js-dekorator-varsel-button");
    var varselliste = document.getElementById("js-dekorator-varsel-liste");
    var apen = false;
    varselbjelle.addEventListener("click", function (event) {
        event.preventDefault();

        if (!apen) {
            varselliste.style.display = "block";

            var top = document.getElementById("js-dekorator-hode").clientHeight + 1;
            var left = varselbjelle.offsetLeft + (varselbjelle.clientWidth / 2) - (document.getElementById("js-dekorator-varsel-liste").clientWidth / 2);
            varselliste.style.top = top;
            varselliste.style.left = left;
        } else {
            varselliste.style.display = "none";
        }

        apen = !apen;
        varselbjelle.setAttribute("aria-pressed", apen);
    });

    if (varsler && varsler.length > 0) {
        varselbjelle.className += " harvarsler";
        populerVarselListe(varsler);
    } else {
        varselliste.innerHTML += '<p>Du har ingen varsler</p>';
    }
};

function populerVarselListe(varsler) {
    var varselliste = document.getElementById("js-dekorator-varsel-liste-elementer");
    varsler.sort(function (a, b) {
        return b.opprettetTidspunkt - a.opprettetTidspunkt;
    }).forEach(function (varsel) {
        if (sjekkOmVarselSkalMarkeresSomLest(varsel)) {
            markerVarselSomLest(varsel);
            varsel.lest = true;
        }
        var lest = varsel.lest ? ' class=\"lest\"' : '';
        varselliste.innerHTML += '<li' + lest + '><p>' + getTidFraZulu(varsel.opprettetTidspunkt) + '</p><a href=' + varsel.url + '>' + varsel.tekst + '</a></li>';
    });
}

function sjekkOmVarselSkalMarkeresSomLest(varsel) {
    return window.location.href.includes(varsel.url);
}

function markerVarselSomLest(varsel) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", 'https://' + window.location.host + '/veiledervarsel/rest/varsler/' + varsel.id, true);
    xmlHttp.send(null);
}

function pad(nr) {
    return nr > 9 || nr.length > 1 ? nr : '0' + nr;
}

function getDatoFraZulu(zulutid) {
    var d = new Date(zulutid);
    var dag = pad(d.getDate());
    var maned = pad(d.getMonth() + 1);
    return dag + '.' + maned + '.' + d.getFullYear();
}

function getTidFraZulu(zulutid) {
    var d = new Date(zulutid);
    return getDatoFraZulu(zulutid) + ' kl. ' + pad(d.getHours()) + '.' + pad(d.getMinutes());
}

function getVarsler() {
    var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("GET", 'https://' + window.location.host + '/veiledervarsel/rest/varsler', false);
    xmlHttp.open("GET", 'http://localhost:8380/veiledervarsel/rest/varsler', false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
