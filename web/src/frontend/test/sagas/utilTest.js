import React from 'react';
import { expect } from 'chai';
import { finnMiljoStreng } from '../../js/sagas/util';


describe("Util - finnMiljoStreng", () => {

    describe("T1", () => {
        beforeEach(() => {
            global.window = {
                location: {
                    host: 'modapp-t1.adeo.no',
                },
            };
        });

        it("Returnerer -t1 hvis modapp-t1.adeo.no", () => {
            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('-t1');
        });
    });

    describe("Prod", () => {
        beforeEach(() => {
            global.window = {
                location: {
                    host: 'modapp.adeo.no',
                },
            };
        });

        it("Returnerer blankt hvis modapp.adeo.no", () => {
            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('');
        });
    });

    describe("T10", () => {
        beforeEach(() => {
            global.window = {
                location: {
                    host: 'app-t10.adeo.no',
                },
            };
        });

        it("Returnerer -t10 hvis app-t10.adeo.no", () => {
            const baseurl = finnMiljoStreng();
            expect(baseurl).to.equal('-t10');
        });
    });
});
