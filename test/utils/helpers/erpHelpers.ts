import nock from "nock";
import { assert } from "chai";
import * as semver from "semver";
import { WireMock } from "wiremock-captain";

import { ErpStubDriver, RealErpDriver } from "../drivers/ErpStubDriver";
import { ErpDriver } from "../types";

abstract class BaseErpDriverTest {
  public erpDriver: ErpDriver;

  abstract getVersionUrl(): string;
  abstract createErpDriver(): ErpDriver;

  abstract setupHigherVersion(): Promise<void>;
  abstract setupLowerVersion(): Promise<void>;

  constructor() {
    this.erpDriver = this.createErpDriver();
  }

  public async shouldReturnActualVersion() {
    const response = await fetch(this.getVersionUrl());

    const data = await response.json();

    assert.exists(semver.clean(data.tag_name));
  }

  public async shouldReturnHigherVersion(version: string) {
    this.setupHigherVersion();
    this.erpDriver.shouldHaveHigherVersion(version);
  }

  public async shouldReturnLowerVersion(version: string) {
    this.setupLowerVersion();
    this.erpDriver.shouldHaveLowerVersion(version);
  }
}

export class ErpStubDriverTest extends BaseErpDriverTest {
  private driver;
  private baseUrl = `${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`;

  constructor() {
    super();
    const erpStub = new WireMock(this.baseUrl);
    this.driver = new ErpStubDriver(erpStub);
  }

  public createErpDriver() {
    const erpStub = new WireMock(this.baseUrl);
    const driver = new ErpStubDriver(erpStub);

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    return `${this.baseUrl}/api/check-version`;
  }

  public async setupHigherVersion() {
    this.driver.willReturnHigherVersion();
  }
  public async setupLowerVersion() {
    this.driver.willReturnLowerVersion();
  }
}

export class RealErpDriverTest extends BaseErpDriverTest {
  private driver;

  constructor() {
    super();
    this.driver = new RealErpDriver();
  }

  public createErpDriver() {
    const driver = new RealErpDriver();

    driver.setup(this.getVersionUrl());

    return driver;
  }

  public getVersionUrl() {
    nock("https://api.github.com")
      .get("/repos/vaisakhsasikumar/my-electron-app/releases/latest")
      .reply(200, { tag_name: "v1.0.0" });
    return "https://api.github.com/repos/vaisakhsasikumar/my-electron-app/releases/latest";
  }

  public async setupHigherVersion() {
    this.driver.willReturnHigherVersion();
  }
  public async setupLowerVersion() {
    this.driver.willReturnLowerVersion();
  }
}
