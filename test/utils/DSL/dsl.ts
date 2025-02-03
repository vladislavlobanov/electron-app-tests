import { Channels } from "../const";
import type { AppDriver } from "../types";
import { UIAppDriver } from "../drivers/UI";
import { APIAppDriver } from "../drivers/API";
import { ThemeStubDsl } from "./ThemeStubDsl";
import { WireMock } from "wiremock-captain";
import { ThemeStubDriver } from "../drivers/ThemeStubDriver";

/**
 * AppDrivers manages different drivers based on communication channels.
 */
export class AppDrivers implements AppDriver {
  private drivers = {} as Record<Channels, AppDriver>;
  public themeStubDsl: ThemeStubDsl;

  constructor(wireMock: WireMock) {
    this.drivers[Channels.UI] = new UIAppDriver();
    this.drivers[Channels.API] = new APIAppDriver();
    this.themeStubDsl = new ThemeStubDsl(new ThemeStubDriver(wireMock));
  }

  get driver() {
    return this.drivers[Channels.UI];
  }

  // @Override
  public async setQuery(query: string) {
    await this.driver.setQuery(query);
  }

  // @Override
  public async clickRunQuery() {
    await this.driver.clickRunQuery();
  }

  // @Override
  public async getQueryResult() {
    return this.driver.getQueryResult();
  }
}

export class AppDsl {
  private driver: AppDrivers;

  constructor(driver: AppDrivers) {
    this.driver = driver;
  }

  public async setQuery(query: string) {
    await this.driver.setQuery(query);
  }

  public async clickRunQuery() {
    await this.driver.clickRunQuery();
  }

  public async getQueryResult() {
    return this.driver.getQueryResult();
  }
}