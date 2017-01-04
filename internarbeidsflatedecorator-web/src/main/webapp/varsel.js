window.onload = function () {
    var varselbjelle = document.getElementById("js-dekorator-varsel-button");
    var varsler = document.getElementById("js-dekorator-varsel-liste");
    var apen = false;
    varselbjelle.addEventListener("click", function (event) {
        event.preventDefault();

        if (!apen) {
            varsler.style.display = "block";

            var top = document.getElementById("js-dekorator-hode").clientHeight + 1;
            var left = varselbjelle.offsetLeft + (varselbjelle.clientWidth / 2) - (document.getElementById("js-dekorator-varsel-liste").clientWidth / 2);
            varsler.style.top = top;
            varsler.style.left = left;
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
    var varsler = getVarsler();

    if (!varsler) {
        varselliste.innerHTML += '<p>Du har ingen varsler</p>';
    } else {


        JSON.parse(varsler).forEach(function (varsel) {
            var lest = varsel.lest ? ' class=\"lest\"' : '';
            varselliste.innerHTML += '<li' + lest + '><p>' + getTidFraZulu(varsel.opprettetTidspunkt) + '</p><a href=' + varsel.lenke + '>' + varsel.tekst + '</a></li>';
        });
    }
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
    // xmlHttp.open("GET", 'https://' + window.location.host + '/veiledervarsel/rest/varsler', false);
    xmlHttp.open("GET", 'http://localhost:8380/veiledervarsel/rest/varsler', false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
