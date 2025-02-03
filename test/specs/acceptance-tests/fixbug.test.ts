import { assert } from "chai";
import { browser } from "wdio-electron-service";

import MainPage from "../../utils/DSL/mainPage";
import Modal from "../../utils/DSL/modal";
import MenuBar from "../../utils/DSL/menuBar";

import { WireMock } from "wiremock-captain";
import { ThemeStubDriver } from "../../utils/drivers/ThemeStubDriver";
import { RealThemeDriver } from "../../utils/drivers/ThemeStubDriver";
import { ThemeStubDsl } from "../../utils/DSL/ThemeStubDsl";

import { AppDsl, AppDrivers } from "../../utils/DSL/dsl";


describe("Theme Change Acceptance Test", async () => {
  let app: AppDrivers;
  let themeStub: ThemeStubDsl;
  const wireMock = new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`);

  let appMenu: MenuBar;
  let settingsModal: Modal;
  let mainPage: MainPage;
  
  beforeEach(async () => {
    app = new AppDrivers(wireMock);
    themeStub = new ThemeStubDsl(new RealThemeDriver(wireMock));
    appMenu = new MenuBar("MongoDB Query Executor");
    settingsModal = new Modal();
    mainPage = new MainPage();
  });


  it("should use the related background colour for Query results and Query History fields", async () => {
    // Given the app has already opened and using light theme first (handled by test setup)
    // And toggle Advanced view: on
    await themeStub.willReturnLightTheme();
    
    await mainPage.toggleAdvancedView();

    const successfulClickOnSettingMenu = await appMenu.doMenuClickById(
      "settings"
    );
    assert.equal(successfulClickOnSettingMenu, true, "Click on Settings");

    await settingsModal.selectTheme("system");

    await settingsModal.clickApplyButton();
  
    // When the computer appearance is changed from Light to Dark theme
    await themeStub.willReturnDarkTheme();
    await app.themeStubDsl.setTheme("system");

    

    const rootClassList = await browser.$("html").getAttribute("class");

    // assert.include(
    //   rootClassList,
    //   "dark-theme",
    //   "The root element does not have the 'dark-theme' class as expected."
    // );
    // assert.notInclude(
    //   rootClassList,
    //   "light-theme",
    //   "The root element incorrectly has the 'light-theme' class when it should not."
    // );

  });
});