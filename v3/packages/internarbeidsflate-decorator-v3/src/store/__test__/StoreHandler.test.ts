/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { WS } from "vitest-websocket-mock"
import { HttpHandler } from 'msw'
import { SetupServer, setupServer } from 'msw/node'
import { StoreHandler } from "../StoreHandler";
import { AppProps } from "../../types/AppProps";
import { getHandlers, mockMe, updateMockContext } from "../../__mocks__/mock-handlers";
import config from "../../__mocks__/mock-error-config";

const defaultProps: Pick<AppProps, 'appName' | 'environment' | 'showEnheter' | 'showHotkeys' | 'showSearchArea' | 'urlFormat' | 'onEnhetChanged' | 'onFnrChanged'> = {
    appName: 'MOCKS',
    environment: 'q2',
    showEnheter: false,
    showHotkeys: false,
    showSearchArea: false,
    urlFormat: "LOCAL",
    onEnhetChanged: () => null,
    onFnrChanged: () => null,
}

describe('StoreHandler test', () => {
    let ws: WS
    let handlers: HttpHandler[]
    let server: SetupServer
    const veilederIdent = 'V12345'

    beforeEach(() => {
        ws = new WS(`ws://localhost:3000/ws/${veilederIdent}`)
        handlers = getHandlers(ws, config)
        server = setupServer(...handlers)
        server.listen()
    })

    afterEach(() => {
        WS.clean()
        server.close()
    })

    const sendWSMessage = (message: unknown) => {
        ws.send(JSON.stringify(message))
    }


    it('skal fungere så lenge man sender inn veileders ident', async () => {
        const storeHandler = new StoreHandler()
        const spy = vi.spyOn(storeHandler.fnrValueManager, 'changeFnrExternallyToLocalValue')

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, ...defaultProps })
        await ws.connected

        expect(spy).toHaveBeenCalledTimes(0)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
    it('skal sette og sende aktivt fnr hvis den initaliseres med fnr', async () => {
        const storeHandler = new StoreHandler()
        const spy = vi.spyOn(storeHandler.fnrValueManager, 'changeFnrLocallyAndExternally')

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fnr: '10108000398', ...defaultProps })
        await awaitTimeout(10, '')
        await ws.connected

        expect(spy).toHaveBeenCalledOnce()
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.value).toBe('10108000398')
    })
    it('skal sette og sende aktiv enhet hvis den initaliseres med enhet', async () => {
        const storeHandler = new StoreHandler()
        const spy = vi.spyOn(storeHandler.enhetValueManager, 'changeEnhetLocallyAndExternally')

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', ...defaultProps })
        await ws.connected

        expect(spy).toHaveBeenCalledOnce()
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.enhet.value).toBe('0118')
    })
    it('skal vise modal om bruker endrer aktiv bruker i annet vindu', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', fnr: '07063000250', ...defaultProps })
        await ws.connected
        sendWSMessage({ eventType: 'NY_AKTIV_BRUKER' })
        expect(storeHandler.state.fnr.value).toBe('07063000250')

        updateMockContext('aktivBruker', '10108000398')
        sendWSMessage({ eventType: 'NY_AKTIV_BRUKER' })

        await awaitTimeout(10, 'For å la staten bli propagert')

        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.showModal).toBeTruthy()
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
    it('skal vise modal om bruker endrer aktiv enhet i annet vindu', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', ...defaultProps })
        await ws.connected
        sendWSMessage({ eventType: 'NY_AKTIV_ENHET' })
        expect(storeHandler.state.enhet.value).toBe('0118')

        updateMockContext('aktivEnhet', '0219')
        sendWSMessage({ eventType: 'NY_AKTIV_ENHET' })

        await awaitTimeout(10, 'For å la staten bli propagert')

        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.enhet.showModal).toBeTruthy()
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
    it('skal endre fnr om den får ny fnr i props og sende nytt til context-apiet', async () => {
        const storeHandler = new StoreHandler()
        const spy = vi.spyOn(storeHandler.fnrValueManager, 'changeFnrLocallyAndExternally')

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fnr: '10108000398', ...defaultProps })
        await ws.connected

        expect(spy).toHaveBeenCalledOnce()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fnr: '07063000250', ...defaultProps })

        await awaitTimeout(10, 'For å la staten bli propagert')

        expect(spy).toHaveBeenCalledTimes(2)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.value).toBe('07063000250')
    })
    it('skal endre aktiv enhet hvis den får ny enhet i props og sende nytt til context-apiet', async () => {
        const storeHandler = new StoreHandler()
        const spy = vi.spyOn(storeHandler.enhetValueManager, 'changeEnhetLocallyAndExternally')
        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', ...defaultProps })

        await ws.connected

        expect(spy).toHaveBeenCalledOnce()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0219', ...defaultProps })

        await awaitTimeout(10, 'For å la staten bli propagert')

        expect(spy).toHaveBeenCalledTimes(2)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.enhet.value).toBe('0219')
    })
    it('skal hente fnr fra context apiet om `fetchActiveUserOnMount` er satt til true', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fetchActiveUserOnMount: true, ...defaultProps })
        await ws.connected

        await awaitTimeout(10, 'For å la staten bli propagert')
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.value).toBe('07063000250')
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
    it ('skal hente enhet fra context-apiet om `fetchActiveEnhetOnMount` er satt til true', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fetchActiveEnhetOnMount: true, ...defaultProps })
        await ws.connected

        await awaitTimeout(10, 'For å la staten bli propagert')
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.enhet.value).toBe('0219')
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const awaitTimeout = (timeoutMs: number, _: string) => {
    let timeout: ReturnType<typeof setTimeout>
    return new Promise((resolve) => {
        timeout = setTimeout(resolve, timeoutMs)
    }).then(() => clearTimeout(timeout))
}