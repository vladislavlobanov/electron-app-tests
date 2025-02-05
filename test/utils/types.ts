import { Channels } from "./const";

export interface AppDriver {
  setQuery: (query: string) => Promise<void>;
  clickRunQuery: () => Promise<void>;
  getQueryResult: () => Promise<string>;

  toggleAdvancedView: () => Promise<void>;
  getQueryHistoryResults: () => Promise<WebdriverIO.Element[]>;
  getLastQueryFromHistory: () => Promise<string>;
  clickRandomItemInHistory: () => Promise<void>;
  getQueryHistoryResultsContainer: () => Promise<WebdriverIO.Element>;
  getAdvancedViewToggleValue: () => Promise<boolean>;
}

export interface GithubDriver {
  willReturnHigherVersion: () => Promise<void>;
  shouldHaveHigherVersion: (version: string) => Promise<void>;

  willReturnLowerVersion: () => Promise<void>;
  shouldHaveLowerVersion: (version: string) => Promise<void>;
}

export type AllChannels = keyof typeof Channels;
