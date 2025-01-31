import { browser } from "wdio-electron-service";

import {
  ErpStubDriverTest,
  RealErpDriverTest,
} from "../../utils/helpers/erpHelpers";

describe.skip("External System Contracts Test", () => {
  it("should check that application theme corresponds to the OS theme", async () => {
    // Verify the class on the root element
    const rootClassList = await browser.$("html").getAttribute("class");

    console.log(`Root element class list: ${rootClassList}`);

    await expect(rootClassList).toContain("light-theme");
    await expect(rootClassList).not.toContain("dark-theme");
  });
});

describe("External System Stub Contract Test. Github API", async () => {
  const erpStub = new ErpStubDriverTest();

  it("should successfully check version against stub", async () => {
    await erpStub.shouldReturnActualVersion();
  });

  it("should successfully check that higher version exist", async () => {
    await erpStub.shouldReturnHigherVersion("1.0.0");
  });

  it("should successfully check that lower version exist", async () => {
    await erpStub.shouldReturnLowerVersion("1.0.0");
  });
});

describe("External System Test Instance Contract Test. Github API", async () => {
  const erpReal = new RealErpDriverTest();

  it("should successfully check version against stub", async () => {
    await erpReal.shouldReturnActualVersion();
  });
});
