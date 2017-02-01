(function () {
    var varsler;
    try {
        varsler = JSON.parse(getVarsler());
    } catch (e) {
        varsler = [];
    }
    var varselbjelle = document.getElementById("js-dekorator-varsel-button");
    var varselliste = document.getElementById("js-dekorator-varsel-liste");
    var apen = false;
    varselbjelle.addEventListener("click", function (event) {
        event.preventDefault();

        if (!apen) {
            varselliste.style.display = "block";
            var dekoratortopp = (document.getElementById("js-dekorator-hode").clientHeight + 1);
            var dekoratorleft = (varselbjelle.offsetLeft + (varselbjelle.clientWidth / 2) - (document.getElementById("js-dekorator-varsel-liste").clientWidth / 2));
            varselliste.style.top = dekoratortopp + 'px';
            varselliste.style.left = dekoratorleft + 'px';
        } else {
            varselliste.style.display = "none";
        }

        apen = !apen;
        varselbjelle.setAttribute("aria-pressed", apen);
    });

    varsler = populerVarselListe(varsler);
    if (varsler.length > 0) {
        varselbjelle.className += ' harvarsler';
        var varseltall = document.getElementById("js-dekorator-varsel-tall");
        varseltall.innerHTML += varsler.length;
        varseltall.style.display = 'block';
        var varseltallWidth = 10 + (varsler.length.toString().length * 10);
        var varseltallLeft = varselbjelle.offsetLeft + varselbjelle.clientWidth - (varseltallWidth / 2);
        var varseltallTop = varselbjelle.offsetTop - (varseltall.clientHeight / 2);

        varseltall.style.top = varseltallTop + 'px';
        varseltall.style.left = varseltallLeft + 'px';
        varseltall.style.width = varseltallWidth + 'px';
    } else {
        varselliste.innerHTML += '<p>Du har ingen uleste varsler</p>';
    }

    varselliste.innerHTML += '<a class="dekorator__knapp" href="/veiledervarsel/">Alle varsler</a>';


    function populerVarselListe(varsler) {
        var varselliste = document.getElementById("js-dekorator-varsel-liste-elementer");
        return varsler.sort(function (a, b) {
            return b.id - a.id;
        }).map(function (varsel, index) {
            if (sjekkOmVarselSkalMarkeresSomLest(varsel) === true) {
                markerVarselSomLest(varsel);
                varsel.lest = true;
            } else if (index < 5) {
                varselliste.innerHTML += '<li><p>' + getTidFraZulu(varsel.opprettetTidspunkt) + '</p><a href=' + varsel.url + '>' + varsel.tekst + '</a></li>';
            }
            return varsel;
        }).filter(function (varsel) {
            return varsel.lest === false;
        });

    }

    function sjekkOmVarselSkalMarkeresSomLest(varsel) {
        return window.location.href.indexOf(varsel.url) !== -1;
    }

    function markerVarselSomLest(varsel) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", 'https://' + window.location.host + '/veiledervarselrest/rest/varsler/' + varsel.id + '/lest', true);
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
        xmlHttp.open("GET", 'https://' + window.location.host + '/veiledervarselrest/rest/varsler?bareUleste=true', false);
        // xmlHttp.open("GET", 'http://localhost:8380/veiledervarselrest/rest/varsler?bareUleste=true', false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
})();
