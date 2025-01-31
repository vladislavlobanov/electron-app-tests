export interface AppDriver {
  setQuery: (query: string) => Promise<void>;
  clickRunQuery: () => Promise<void>;
  getQueryResult: () => Promise<string>;
}

export interface ErpStubDriverInterface {
  getVersion: () => Promise<void>;

  willReturnHigherVersion: () => Promise<void>;
  willReturnLowerVersion: () => Promise<void>;
}

export interface ErpDriver {
  willReturnHigherVersion: () => Promise<void>;
  shouldHaveHigherVersion: (version: string) => Promise<void>;

  willReturnLowerVersion: () => Promise<void>;
  shouldHaveLowerVersion: (version: string) => Promise<void>;
}

export enum Channels {
  UI = "UI",
  API = "API",
}

export type AllChannels = keyof typeof Channels;
