(function () {
    console.log("Hello");
    var sokefelt = document.getElementById("js-deokorator-sokefelt");

    function triggerPersonsokEvent(personnummer) {
        var personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = personnummer;
        document.dispatchEvent(personsokEvent);
    }

    if (sokefelt) {
        sokefelt.addEventListener("keyup", function (event) {
            var ENTER_KEY_CODE = 13;
            if (event.keyCode === ENTER_KEY_CODE) {
                triggerPersonsokEvent(event.target.value);
            }
        });
    }
})();
