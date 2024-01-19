import { describe, it, beforeEach, afterEach, expect, vi, MockInstance } from "vitest";
import { WS } from "vitest-websocket-mock"
import { HttpHandler } from 'msw'
import { SetupServer, setupServer } from 'msw/node'
import { Store, StoreHandler } from "../StoreHandler";
import { AppProps } from "../../types/AppProps";
import { getHandlers, mockMe, updateMockContext } from "../../__mocks__/mock-handlers";
import config from "../../__mocks__/mock-error-config";
import { ContextHolderAPI } from "../../api/ContextHolderAPI";

const defaultProps: Pick<AppProps, 'appName' | 'environment' | 'showEnheter' | 'showHotkeys' | 'showSearchArea' | 'urlFormat' | 'onEnhetChanged' | 'onFnrChanged'> = {
    appName: 'MOCKS',
    environment: 'q2',
    showEnheter: false,
    showHotkeys: false,
    showSearchArea: false,
    urlFormat: "LOCAL",
    onEnhetChanged: (_) => null,
    onFnrChanged: (_) => null,
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

    const sendWSMessage = (message: any) => {
        ws.send(JSON.stringify(message))
    }


    it('skal fungere så lenge man sender inn veileders ident', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, ...defaultProps })
        // TODO: Vil vi ikke hente aktiv enhet og fnr her?
        const spy = spyOnContextholderApi(storeHandler, 'getVeiledersActiveFnr')
        await ws.connected

        expect(spy).toHaveBeenCalledTimes(0)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
    })
    it('skal sette og sende aktivt fnr hvis den initaliseres med fnr', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fnr: '10108000398', ...defaultProps })
        const spy = spyOnContextholderApi(storeHandler, 'changeFnr')
        await ws.connected

        expect(spy).toHaveBeenCalledOnce()
        expect(storeHandler.state.veileder).toStrictEqual(mockMe)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.value).toBe('10108000398')
    })
    it('skal sette og sende aktiv enhet hvis den initaliseres med enhet', async () => {
        const storeHandler = new StoreHandler()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', ...defaultProps })
        const spy = spyOnContextholderApi(storeHandler, 'changeEnhet')
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

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, fnr: '10108000398', ...defaultProps })
        const spy = spyOnContextholderApi(storeHandler, 'changeFnr')
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

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0118', ...defaultProps })
        const spy = spyOnContextholderApi(storeHandler, 'changeEnhet')

        await ws.connected

        expect(spy).toHaveBeenCalledOnce()

        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, enhet: '0219', ...defaultProps })

        await awaitTimeout(10, 'For å la staten bli propagert')
        expect(spy).toHaveBeenCalledTimes(2)
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.enhet.value).toBe('0219')
    })
    it('skal hente fnr hvis userKey sendes inn', async () => {
        const storeHandler = new StoreHandler()
        storeHandler.propsUpdateHandler.onPropsUpdated({ veiledersIdent: veilederIdent, userKey: 'hfdjkdshfu21', ...defaultProps })
        const spy = spyOnContextholderApi(storeHandler, 'changeFnr')
        await awaitTimeout(10, 'For å la staten bli propagert')

        expect(spy).toHaveBeenCalledOnce()
        expect(Object.values(storeHandler.state.errorMessages).length).toBe(0)
        expect(storeHandler.state.fnr.value).toBe('10108000398')
    })
})

const awaitTimeout = (timeoutMs: number, _: string) => {
    let timeout: ReturnType<typeof setTimeout>
    return new Promise((resolve) => {
        timeout = setTimeout(resolve, timeoutMs)
    }).then(() => clearTimeout(timeout))
}

const spyOnContextholderApi = (storeHandler: StoreHandler, method: keyof ContextHolderAPI): MockInstance<[], never> => {
   // @ts-ignore
   return vi.spyOn(storeHandler.contextHolderApi, method) 
}
