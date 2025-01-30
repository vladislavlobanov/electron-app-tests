export interface AppDriver {
  setQuery: (query: string) => Promise<void>;
  clickRunQuery: () => Promise<void>;
  getQueryResult: () => Promise<string>;
}

export interface ErpStubDriverInterface {
  getVersion: () => Promise<void>;
}

export enum Channels {
  UI = "UI",
  API = "API",
}

export type AllChannels = keyof typeof Channels;
