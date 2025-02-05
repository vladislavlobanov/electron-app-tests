import { assert } from "chai";
import { browser } from "wdio-electron-service";

import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";

import { WireMock } from "wiremock-captain";
import { GithubStubDriver } from "../../utils/drivers/GithubStubDriver";
import { GithubStubDsl } from "../../utils/DSL/GithubStubDsl";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";

//Seeing Persisting Query History should run first
describe("Seeing Persisting Query History", async () => {
  let application = new AppDsl(new AppDrivers(["UI", "API"]));

  it("should have saved queries under Query History", async () => {
    await application.toggleAdvancedView();
    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    const lastQueryHistoryResult = await application.getLastQueryFromHistory();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });

  it("should use previous saved query and the result", async () => {
    let historyList = await application.getQueryHistoryResults();
    const initialHistoryLength = historyList.length;

    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();
    console.log(
      "TEST LOGS",
      historyList.length,
      initialHistoryLength + 1,
      typeof historyList,
      typeof initialHistoryLength
    );
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 1);

    await application.setQuery(`{"name":"test2"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 2);

    await application.setQuery(`{"name":"test3"}`);
    await application.clickRunQuery();
    historyList = await application.getQueryHistoryResults();
    await expect(historyList).toBeElementsArrayOfSize(initialHistoryLength + 3);
  });

  it("should have previous saved queries when changing the Advanced view from off to on", async () => {
    const historyList = application.getQueryHistoryResults();
    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });

    await application.toggleAdvancedView();
    await application.toggleAdvancedView();

    expect(historyList).toBeElementsArrayOfSize({ gte: 1 });
  });

  it("should continue to save queries when the Advanced view: off into the Query History ", async () => {
    await application.toggleAdvancedView();

    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    await application.toggleAdvancedView();

    const lastQueryHistoryResult = await application.getLastQueryFromHistory();

    await expect(lastQueryHistoryResult).toContain(
      `Query: {"name":"test1"} | Result:`
    );
  });
});

describe("Advanced View Toggle Test", () => {
  const application = new AppDsl(new AppDrivers(["UI", "API"]));

  it("should toggle advanced view and toggle query history", async () => {
    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    await expect(queryHistorySection).toBeDisplayed();

    await application.toggleAdvancedView();

    await expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Viewing Results in JSON Format", () => {
  const application = new AppDsl(new AppDrivers(["UI", "API"]));

  it("should successfully run a find query and have a Query Result in JSON format", async () => {
    await application.setQuery(`{"name":"test1"}`);
    await application.clickRunQuery();

    const resultText = await application.getQueryResult();

    await expect(resultText).toContain(`"name": "test1"`);
  });
});

describe("Change the Advanced View", async () => {
  const application = new AppDsl(new AppDrivers(["UI", "API"]));

  it("should successfully toggle Advanced view: on", async () => {
    await browser.reloadSession();

    let isToggleOff = await application.getAdvancedViewToggleValue();
    await expect(isToggleOff).toBe(false);

    await application.toggleAdvancedView();
    isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(true);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).toBeDisplayed();
  });

  it("should successfully toggle Advanced view: off", async () => {
    await application.toggleAdvancedView();
    const isToggleOff = await application.getAdvancedViewToggleValue();

    expect(isToggleOff).toBe(false);

    const queryHistorySection =
      await application.getQueryHistoryResultsContainer();

    expect(queryHistorySection).not.toBeDisplayed();
  });
});

describe("Settings", async () => {
  const application = new AppDsl(new AppDrivers(["UI", "API"]));

  beforeEach(async () => {
    await browser.reloadSession();
  });

  it("should successfully show the Settings menu", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.checkMenuItems();
  });

  it("should successfully open the Settings menu", async () => {
    await application.checkAppMenuExist();

    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();
  });

  it("should show the Settings menu options", async () => {
    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();

    await application.checkLightThemeSwitchVisible();

    await application.checkDarkThemeSwitchVisible();

    await application.checkSystemThemeSwitchVisible();

    await application.checkUriInputVisible();

    await application.checkDatabaseNameInputVisible();

    await application.checkCollectionNameInputVisible();

    await application.checkApplySettingsButtonVisible();

    await application.checkCancelSettingsButtonVisible();
  });

  it("should show the default options in the Settings menu", async () => {
    await application.clickOnAppMenu();

    await application.clickOnSettingsMenu();

    await application.checkSettingsMenuVisible();

    await application.checkDefaultTheme();

    await application.checkDefaultUri();

    await application.checkDefaultDatabaseName();

    await application.checkDefaultCollectionName();
  });
});

// describe.skip("Advanced View Startup Preference", async () => {
//   it("should enable Advanced View on startup", async () => {
//     await browser.reloadSession();

//     const mainPage = new MainPage();

//     const settingsModal = new Modal();

//     const appMenu = new MenuBar("MongoDB Query Executor");

//     const appMenuExists = await appMenu.doesAppMenuExist();

//     assert.equal(
//       appMenuExists,
//       true,
//       "MongoDB Query Executor menu item exists"
//     );

//     const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

//     assert.equal(
//       successfulClickOnAppMenu,
//       true,
//       "Click on MongoDB Query Executor"
//     );

//     const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
//       "settings"
//     );

//     assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

//     const settingsModalVisible = await settingsModal.modal;

//     await expect(settingsModalVisible).toBeDisplayed();

//     await settingsModal.clickAdvancedViewOnStartCheckbox();
//     await settingsModal.clickApplyButton();

//     await browser.reloadSession();

//     const queryHistoryResults = await mainPage.queryHistoryResults;

//     await expect(queryHistoryResults).toBeDisabled();
//   });
// });

// ========== Maintainable Acceptance Test Start ==========

describe("MongoDB Query Execution Test", async () => {
  const application = new AppDsl(new AppDrivers(["UI", "API"]));

  it("should execute a simple query and display results", async () => {
    await application.setQuery("{}");
    await application.clickRunQuery();
    const queryResult = await application.getQueryResult();

    assert.notInclude(
      queryResult,
      "Invalid query",
      'Query result should not contain "Invalid query"'
    );
    assert.include(queryResult, "test1", "Query result should contain field");
    assert.include(queryResult, "test2", "Query result should contain field");
    assert.include(queryResult, "test3", "Query result should contain field");
  });

  it("should execute a simple unsuccessful query and display error", async () => {
    await application.setQuery('{"name":"test4}');
    await application.clickRunQuery();
    const queryResult = await application.getQueryResult();

    assert.include(
      queryResult,
      "Invalid query or server error.",
      'Query result should not contain "Invalid Query"'
    );
  });
});

// ========== External Systems but for Acceptance - Theme  ==========
// Theme selection follows DSL but not Four Layer Model due to technical limitations.

describe("Select Theme", async () => {
  let appMenu: MenuBar;
  let settingsModal: Modal;

  beforeEach(() => {
    appMenu = new MenuBar("MongoDB Query Executor");
    settingsModal = new Modal();
  });

  it("should show the default Theme", async () => {
    await browser.reloadSession();

    const appMenuExists = await appMenu.doesAppMenuExist();

    assert.equal(
      appMenuExists,
      true,
      "MongoDB Query Executor menu item exists"
    );

    const successfulClickOnAppMenu = await appMenu.doMenuClickById("appName");

    assert.equal(
      successfulClickOnAppMenu,
      true,
      "Click on MongoDB Query Executor"
    );

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    const systemThemeRadio = await settingsModal.systemThemeRadio;
    await expect(systemThemeRadio).toBeChecked();
  });

  it("should click the Cancel button", async () => {
    await browser.reloadSession();

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );

    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    await settingsModal.selectTheme("dark");

    await settingsModal.clickCancelButton();

    const theme = process.env.WDIO_THEME;

    const rootClassList = await browser.$("html").getAttribute("class");

    if (theme === "dark") {
      assert.include(
        rootClassList,
        "dark-theme",
        "The root element does not have the 'dark-theme' class as expected."
      );
      assert.notInclude(
        rootClassList,
        "light-theme",
        "The root element incorrectly has the 'light-theme' class when it should not."
      );
    } else {
      assert.include(
        rootClassList,
        "light-theme",
        "The root element does not have the 'light-theme' class as expected."
      );
      assert.notInclude(
        rootClassList,
        "dark-theme",
        "The root element incorrectly has the 'dark-theme' class when it should not."
      );
    }
  });

  it("should click the Apply button", async () => {
    await browser.reloadSession();

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );
    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    await settingsModal.selectTheme("dark");

    await settingsModal.clickApplyButton();

    const rootClassList = await browser.$("html").getAttribute("class");

    assert.include(
      rootClassList,
      "dark-theme",
      "The root element does not have the 'dark-theme' class as expected."
    );
    assert.notInclude(
      rootClassList,
      "light-theme",
      "The root element incorrectly has the 'light-theme' class when it should not."
    );
  });
});

// ========== External Systems but for Acceptance - Version ==========
// Uses Four Layer Model.
// Stubbed API is used for educational purposes due to GitHub API limitations (no more than 60 calls per day)

describe("Version", async () => {
  const githubStubDsl = new GithubStubDsl(
    new GithubStubDriver(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    )
  );

  it("should successfully check version against stub", async () => {
    const appVersion = await githubStubDsl.getVersion();

    await expect(appVersion).toBeDefined();
  });
});

//Maintainable Acceptance Test end
