import { WireMock } from "wiremock-captain";
import nock from "nock";

import { ErpStubDriver } from "./ErpStubDriver";

abstract class BaseErpTest {
  abstract getVersionUrl(): string;

  public async getVersion() {
    const response = await fetch(this.getVersionUrl());

    const data = await response.json();

    return data.tag_name;
  }
}

export class ErpStubTest extends BaseErpTest {
  private driver: ErpStubDriver;
  private baseUrl = `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`;

  constructor() {
    super();
    const erpStub = new WireMock(this.baseUrl);
    this.driver = new ErpStubDriver(erpStub);
  }

  public getVersionUrl() {
    return `${this.baseUrl}/api/check-version`;
  }
}

export class RealErpTest extends BaseErpTest {
  constructor() {
    super();
  }

  public getVersionUrl() {
    nock("https://api.github.com")
      .get("/repos/vaisakhsasikumar/my-electron-app/releases/latest")
      .reply(200, { tag_name: "v1.0.29" });
    return "https://api.github.com/repos/vaisakhsasikumar/my-electron-app/releases/latest";
  }

  public async willReturnLowerVersion() {}
  public async willReturnHigherVersion() {}
}
