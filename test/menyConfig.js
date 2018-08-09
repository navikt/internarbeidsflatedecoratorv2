import {expect} from 'chai';

import {arenaLenke} from "../js/menyConfig";

const AREMARK_FNR = '***REMOVED***8';

describe("Lenker", () => {

    describe("arena lenke", () => {
        it("med person i kontekst", () => {
            const lenke = arenaLenke(AREMARK_FNR);
            expect(lenke.url).to.equal(`http://arena.adeo.no/forms/arenaMod.html?oppstart_skj=AS_REGPERSONALIA&fodselsnr=${AREMARK_FNR}`);
        });

        it("uten person i kontekst", () => {
            const lenke = arenaLenke();
            expect(lenke.url).to.equal('http://arena.adeo.no/forms/frmservlet?config=arena');
        });
    });

});
