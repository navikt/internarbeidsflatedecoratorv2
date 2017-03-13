import Promise from 'bluebird';
global.Promise = Promise;

const init = () => {
    var hode = document.getElementById("js-dekorator-hode");
    var knapp = document.getElementById("js-dekorator-toggle-meny");
    var navContainer = document.getElementById("js-dekorator-nav-container");
    var nav = document.getElementById("js-dekorator-nav");
    var hjemLenke = document.getElementById("js-dekorator-hjem");

    hjemLenke.setAttribute("href", window.location.pathname);
    var apen = false;
    var menyInnhold = nav.innerHTML;
    nav.innerHTML = "";

    function whichTransitionEvent() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    knapp.addEventListener("click", function (event) {
        event.preventDefault();
        if (!apen) {
            nav.innerHTML = menyInnhold;
            var hoyde = nav.offsetHeight;
            navContainer.style.height = hoyde + "px";
            knapp.className += " dekorator__hode__toggleMeny--apen";
            hode.className += " dekorator__hode--apen";
        } else {
            navContainer.style.height = nav.offsetHeight + "px";
            navContainer.style.overflow = "hidden";
            setTimeout(function () {
                navContainer.style.height = "0";
            }, 0);
            knapp.className = "dekorator__hode__toggleMeny";
        }
        apen = !apen;
        knapp.setAttribute("aria-pressed", apen);
    });

    navContainer.addEventListener(whichTransitionEvent(), function (event) {
        if (apen) {
            navContainer.className = "dekorator__nav dekorator__nav--apen";
            navContainer.removeAttribute("style");
        } else {
            navContainer.className = "dekorator__nav";
            navContainer.removeAttribute("style");
            nav.innerHTML = "";
            hode.className = "dekorator__hode";
        }
    });

    nav.addEventListener("keyup", function (event) {
        var OPP = 38;
        var NED = 40;
        var settFokus = function (liEl) {
            if (!liEl) {
                return;
            }
            var lenke = liEl.getElementsByTagName("a")[0];
            lenke.focus();
        };
        var target = event.target;
        var tagName = event.target.tagName;
        if (tagName.toUpperCase() === "A") {
            switch (event.keyCode) {
                case OPP: {
                    event.preventDefault();
                    var forrige = event.target.parentNode.previousElementSibling;
                    settFokus(forrige);
                    return;
                }
                case NED: {
                    event.preventDefault();
                    var neste = event.target.parentNode.nextElementSibling;
                    settFokus(neste);
                    return;
                }
                    return;
            }
        }
    });
};

export default init;
