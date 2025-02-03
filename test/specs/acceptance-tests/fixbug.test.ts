import { expect } from "chai";
import { AppDrivers } from "../../utils/DSL/dsl";
import { WireMock } from "wiremock-captain";

describe("Theme Appearance Change Acceptance Test", () => {
  let app: AppDrivers;

  // Before each test, create a new AppDrivers instance with our WireMock instance.
  beforeEach(() => {
    app = new AppDrivers(
      new WireMock(`${process.env.WIREMOCK_HOST}:${process.env.WIREMOCK_PORT}`)
    );
  });

  it("should use the related dark background colour for Query Results and Query History fields when theme is changed from light to dark", async () => {
    // GIVEN: the app has already opened
    // AND: the computer appearance is Light initially.
    await app.themeStubDsl.willReturnTheme("light");

    // Set a simple query and run to populate the Query Results and Query History fields.
    await app.setQuery("{}");
    await app.clickRunQuery();

    // Use selectors from the DSL (or directly via browser.$) to capture CSS style values.
    // For Query Results we use the [data-testid="queryResult"] element.
    const queryResultElement = await $('[data-testid="queryResult"]');
    const queryResultLightBg = (await queryResultElement.getCSSProperty("background-color")).value;

    // For Query History, we assume that each history record is marked with [data-testid="queryHistorySingleElement"]
    // and we take the last one.
    const queryHistoryElements = await $$('[data-testid="queryHistorySingleElement"]');
    const lastHistoryElement = queryHistoryElements[queryHistoryElements.length - 1];
    const queryHistoryLightBg = (await lastHistoryElement.getCSSProperty("background-color")).value;

    // WHEN: the computer appearance is changed from Light to Dark theme.
    await app.themeStubDsl.willReturnTheme("dark");

    // To see the effect of theme change, re-run the query.
    await app.setQuery("{}");
    await app.clickRunQuery();

    // Obtain the updated background colours.
    const queryResultDarkBg = (await queryResultElement.getCSSProperty("background-color")).value;
    const updatedHistoryElements = await $$('[data-testid="queryHistorySingleElement"]');
    const lastHistoryElementDark = updatedHistoryElements[updatedHistoryElements.length - 1];
    const queryHistoryDarkBg = (await lastHistoryElementDark.getCSSProperty("background-color")).value;

    // THEN: The Query Results and Query History fields should show a dark background colour – 
    // (i.e. the CSS background-colour values have changed to a value different from the light one).
    expect(queryResultDarkBg).to.not.equal(queryResultLightBg);
    expect(queryHistoryDarkBg).to.not.equal(queryHistoryLightBg);

    // Optionally, if you know the specific dark theme background colour (for example "rgb(39, 39, 39)")
    // then assert that. For now we simply check that the returned value is in an RGB format.
    expect(queryResultDarkBg).to.match(/rgb\(/);
    expect(queryHistoryDarkBg).to.match(/rgb\(/);
  });
});