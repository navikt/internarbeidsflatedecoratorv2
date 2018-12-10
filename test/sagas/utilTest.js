import React from 'react';
import { expect } from 'chai';
import { finnMiljoStreng, finnNaisMiljoStreng, NAIS_PREPROD_SUFFIX, NAIS_PROD_SUFFIX } from '../../js/sagas/util';

const setHost = (host) => {
    global.window = {
        location: { host },
    };
};

describe("Util - finnMiljoStreng", () => {
    describe("T1", () => {
        it("Returnerer -t1 hvis modapp-t1.adeo.no", () => {
            setHost('modapp-t1.adeo.no');

            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('-t1');
        });
    });

    describe("Prod", () => {
        it("Returnerer blankt hvis modapp.adeo.no", () => {
            setHost('modapp.adeo.no');

            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('');
        });
    });

    describe("T10", () => {
        it("Returnerer -t10 hvis app-t10.adeo.no", () => {
            setHost('app-t10.adeo.no');

            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('-t10');
        });
    });
});

describe("Util - finnNaisMiljoStreng", () => {
    describe("T6", () => {
        it("Returnerer preprod.local hvis modapp-t1.adeo.no", () => {
            setHost('modapp-t1.adeo.no');

            const miljostreng = finnNaisMiljoStreng();
            expect(miljostreng).to.equal(NAIS_PREPROD_SUFFIX);
        });
    });
    describe("Q1", () => {
        it("Returnerer preprod.local hvis modapp-q1.adeo.no", () => {
            setHost('modapp-q1.adeo.no');

            const miljostreng = finnNaisMiljoStreng();
            expect(miljostreng).to.equal(NAIS_PREPROD_SUFFIX);
        });
    });
    describe("Prod", () => {
        it("Returnerer adeo.no hvis modapp.adeo.no", () => {
            setHost('modapp.adeo.no');

            const miljostreng = finnNaisMiljoStreng();
            expect(miljostreng).to.equal(NAIS_PROD_SUFFIX);
        });
    });

});
