import { ContextHolderAPI } from './ContextHolderAPI';

export class API {
  #token: string;
  contextHolder: ContextHolderAPI;
  constructor(token: string) {
    this.#token = token;
    this.contextHolder = new ContextHolderAPI(this.#token);
  }
}
