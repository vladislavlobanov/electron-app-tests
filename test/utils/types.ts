import { Channels } from "./const";

export interface AppDriver {
  setQuery: (query: string) => Promise<void>;
  clickRunQuery: () => Promise<void>;
  getQueryResult: () => Promise<string>;
}

export interface GithubStubDriverInterface {
  getVersion: () => Promise<void>;

  willReturnHigherVersion: () => Promise<void>;
  willReturnLowerVersion: () => Promise<void>;
}

export interface GithubDriver {
  willReturnHigherVersion: () => Promise<void>;
  shouldHaveHigherVersion: (version: string) => Promise<void>;

  willReturnLowerVersion: () => Promise<void>;
  shouldHaveLowerVersion: (version: string) => Promise<void>;
}

export type AllChannels = keyof typeof Channels;
