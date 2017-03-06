(function () {
    var MAKS_ANTALL_TEGN_I_NAVN = 25;

    function fornavn(navn) {
        return navn.split(/\s+/)[0];
    }

    function mellomnavn(navn) {
        var navneliste = navn.split(/\s+/);
        return navneliste.splice(1, navneliste.length - 2);
    }

    function etternavn(navn) {
        var navneliste = navn.split(/\s+/);
        return navneliste[navneliste.length - 1];
    }

    function tilInitial(navn) {
        return navn.substring(0, 1) + '.';
    }

    function forkortMellomnavn(navn) {
        return [fornavn(navn)].concat(mellomnavn(navn).map(function (x) {
            return tilInitial(x)
        })).concat(etternavn(navn)).join(' ');
    }

    function forkortEtternavn(navn) {
        return fornavn(navn) + " " + tilInitial(etternavn(navn));
    }

    function visningsnavn(navn) {
        if (navn.length <= MAKS_ANTALL_TEGN_I_NAVN) {
            return navn;
        }
        var forkortetNavn = forkortMellomnavn(navn);
        if (forkortetNavn.length <= MAKS_ANTALL_TEGN_I_NAVN) {
            return forkortetNavn;
        }
        return forkortEtternavn(navn);
    }
})();