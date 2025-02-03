import { AppDrivers } from "../../utils/DSL/dsl";
import { WireMock } from "wiremock-captain";
import { ThemeStubDsl } from "../../utils/DSL/ThemeStubDsl";
import { RealThemeDriver } from "../../utils/drivers/ThemeStubDriver";


describe("Theme Change Acceptance Test", async () => {
  let app: AppDrivers;
  let themeStub: ThemeStubDsl;
  const wireMock = new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`);

  beforeEach(async () => {
    app = new AppDrivers(wireMock);
    themeStub = new ThemeStubDsl(new RealThemeDriver(wireMock));
  });


  it("should use the related background colour for Query results and Query History fields", async () => {
    // Given the app has already opened and using light theme first (handled by test setup)
    // And toggle Advanced view: on

    await themeStub.willReturnLightTheme();

    await app.themeStubDsl.setTheme( 'system');

    await app.driver.toggleAdvancedView();
    await app.driver.setQuery("{}");
    await app.driver.clickRunQuery();

    const lightThemeResultBackground = await app.driver.getQueryResult();
    const lightThemeHistoryBackground = await app.driver.getLastQueryHistoryText();

    // When the computer appearance is changed from Light to Dark theme
    await themeStub.willReturnDarkTheme();
    await app.themeStubDsl.setTheme("system");

    //Then Query Results and Query History fields should show dark background colour.
    const darkThemeResultBackground = await app.driver.getQueryResult();
    const darkThemeHistoryBackground = await app.driver.getLastQueryHistoryText();


    //Asserts for queryResult field
    expect(lightThemeResultBackground).not.toContain("background-color: rgb(30, 30, 30);")
    expect(darkThemeResultBackground).toContain("background-color: rgb(30, 30, 30);");

    //Asserts for queryHistory field
    expect(lightThemeHistoryBackground).not.toContain("background-color: rgb(30, 30, 30);");
    expect(darkThemeHistoryBackground).toContain("background-color: rgb(30, 30, 30);");

  });
});