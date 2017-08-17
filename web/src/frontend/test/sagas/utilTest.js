import React from 'react';
import { expect } from 'chai';
import { finnMiljoStreng } from '../../js/sagas/util';

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
