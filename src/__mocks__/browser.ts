import { setupWorker } from 'msw/browser';
import { getHandlers } from './mock-handlers';
import config from './mock-error-config';

export const worker = setupWorker(...getHandlers(config));
