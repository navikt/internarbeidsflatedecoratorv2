export interface FailureConfig {
    meEndpoint: boolean;
    aktorIdEndpoint: boolean;
    enhetEndpoint: boolean;
    websocketConnection: boolean;
    contextholder: {
        updateEnhet: boolean;
        updateBruker: boolean;
        deleteEnhet: boolean;
        deleteBruker: boolean;
        getEnhet: boolean;
        getBruker: boolean;
        get: boolean;
    };
}

const config: FailureConfig = {
    meEndpoint: false,
    aktorIdEndpoint: false,
    enhetEndpoint: false,
    websocketConnection: false,
    contextholder: {
        updateEnhet: false,
        updateBruker: false,
        deleteEnhet: false,
        deleteBruker: false,
        getEnhet: false,
        getBruker: false,
        get: false
    }
};

export default config;