import { WireMock } from "wiremock-captain";

import { ErpStubDriverInterface } from "../types";

export class ErpStubDriver implements ErpStubDriverInterface {
  private driver: WireMock;

  constructor(driver: WireMock) {
    this.driver = driver;
  }

  public async getVersion() {
    const response = await fetch(
      `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}/api/check-version`
    );

    const data = await response.json();

    return data.tag_name;
  }
}
