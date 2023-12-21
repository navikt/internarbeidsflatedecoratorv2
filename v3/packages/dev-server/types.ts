/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, ServerWebSocket } from 'bun';

export interface BunRequest extends Request {
  params: Params;
  haveParam: (key: string) => boolean;
  upgrade: <T = any>(metadata?: T | undefined) => boolean | undefined;
}

export interface BaseRoute {
  path: string;
  parts: Part[];
}

export interface Route extends BaseRoute {
  method: Method;
  handler: (
    request: BunRequest,
    server: Server,
  ) => Response | Promise<Response>;
}

export interface Part {
  name: string;
  isParam: boolean;
}

export interface WebSocketRoute<T = any> extends BaseRoute {
  handler: {
    open: (ws: BunServerWebsocket, params: T) => void | Promise<void>;
    close: (ws: BunServerWebsocket, params: T) => void | Promise<void>;
    message: (
      ws: BunServerWebsocket,
      message: string | Buffer,
      params: T,
    ) => void | Promise<void>;
  };
}

export type Params = Record<string, any>;
export type BunServerMetadata = BaseRoute & {
  metadata?: Record<string, any> | undefined;
};
export type BunServerWebsocket = ServerWebSocket<BunServerMetadata>;

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export type Handler = (
  request: BunRequest,
  server: Server,
) => Response | Promise<Response>;
