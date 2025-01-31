import { browser } from "wdio-electron-service";
import * as semver from "semver";

import { ErpStubTest, RealErpTest } from "../../utils/drivers/baseStubDriver";

describe("External System Contracts Test", () => {
  it("should check that application theme corresponds to the OS theme", async () => {
    // Verify the class on the root element
    const rootClassList = await browser.$("html").getAttribute("class");

    console.log(`Root element class list: ${rootClassList}`);

    await expect(rootClassList).toContain("light-theme");
    await expect(rootClassList).not.toContain("dark-theme");
  });
});

describe("External System Stub Contract Test. Github API", async () => {
  const erpStub = new ErpStubTest();

  it("should successfully check version against stub", async () => {
    const version = await erpStub.getVersion();

    const stubVersion = semver.clean(version);

    await expect(stubVersion).toBe("10.0.0");
  });
});

describe("External System Test Instance Contract Test. Github API", async () => {
  const erpReal = new RealErpTest();

  it("should successfully check version against stub", async () => {
    const version = await erpReal.getVersion();

    const stubVersion = semver.clean(version);

    await expect(stubVersion).toBe("1.0.29");
  });
});
