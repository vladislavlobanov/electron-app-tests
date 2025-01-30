import { AllChannels, AppDriver, Channels } from "../types";
import { UIAppDriver } from "../drivers/UI";

export class AppDrivers implements AppDriver {
  private driver!: AppDriver;

  constructor(channel: AllChannels) {
    switch (channel) {
      case Channels.API:
        // this.drivers[Channels.API] = new UIAppDriver();
        break;
      case Channels.UI: {
        this.driver = new UIAppDriver();
        break;
      }
      default:
        break;
    }
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
