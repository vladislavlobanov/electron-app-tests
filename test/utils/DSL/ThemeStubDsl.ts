import { WireMock } from "wiremock-captain";
import { ThemeStubDriver } from "../drivers/ThemeStubDriver";

export class ThemeStubDsl {
  private driver: ThemeStubDriver;

  constructor(driver: ThemeStubDriver) {
    this.driver = driver;
  }

  public async setTheme(theme: 'light' | 'dark' | 'system'){
    await this.driver.setTheme(theme);
  }

  public async willReturnLightTheme() {
    await this.driver.willReturnLightTheme();
  }
  public async willReturnDarkTheme() {
    await this.driver.willReturnDarkTheme();
  }
}