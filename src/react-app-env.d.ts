/// <reference types="react-scripts" />

interface ImportMetaEnv {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    readonly MOCK: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
