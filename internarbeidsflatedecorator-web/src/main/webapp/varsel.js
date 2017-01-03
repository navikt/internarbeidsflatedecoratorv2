window.onload = function () {
    var varselbjelle = document.getElementById("js-dekorator-varsel-button");
    var varsler = document.getElementById("js-dekorator-varsel-liste");
    var apen = false;
    varselbjelle.addEventListener("click", function (event) {
        event.preventDefault();
        if (!apen) {
            varsler.style.display = "block";
        } else {
            varsler.style.display = "none";
        }

        apen = !apen;
        varselbjelle.setAttribute("aria-pressed", apen);
    });
    populerVarselListe();
};


function populerVarselListe() {
    var varselliste = document.getElementById("js-dekorator-varsel-liste-elementer");

    JSON.parse(getVarsler()).forEach(function (varsel) {
        varselliste.innerHTML += '<li><p>' + getTidFraZulu(varsel.opprettetTidspunkt) + '</p><a href=' + varsel.lenke + '>' + varsel.tekst + '</a></li>';
    });
};

function pad(nr) {
    return nr > 9 || nr.length > 1 ? nr : '0' + nr;
};

function getDatoFraZulu(zulutid) {
    var d = new Date(zulutid);
    var dag = pad(d.getDate());
    var maned = pad(d.getMonth() + 1);
    return dag + '.' + maned + '.' + d.getFullYear();
};

function getTidFraZulu(zulutid) {
    var d = new Date(zulutid);
    return getDatoFraZulu(zulutid) + ' kl. ' + pad(d.getHours()) + '.' + pad(d.getMinutes());
};


function getVarsler() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'https://' + window.location.host + '/veiledervarsel/rest/varsler', false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
