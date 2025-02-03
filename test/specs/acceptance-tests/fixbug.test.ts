import { expect } from "chai";
import { AppDrivers } from "../../utils/DSL/dsl";
// Note: Do NOT import any ThemeStubDsl or other new files.

describe("Feature: Change the computer appearance from Light to Dark theme when using Advanced view: on", () => {
  let app: AppDrivers;

  beforeEach(() => {
    // Initialize the app driver.
    // It is assumed that the app driver is already configured to point to the target application.
    app = new AppDrivers();
  });

  it("Scenario: Use the related background colour for Query results and Query History fields", async () => {
    // GIVEN the app has already opened
    // AND the computer appearance is Light initially.
    // (Simulate a Light theme by calling an already available method on app.driver.)
    await app.driver.setTheme("light");

    // Open the app with a sample query, then run the query.
    await app.setQuery("{}");
    await app.clickRunQuery();

    // AND toggle Advanced view: on.
    await app.driver.toggleAdvancedView();

    // AND see (capture) the Query Results and Query History fields background colours.
    const queryResultBackgroundLight = await app.driver.getQueryResultBackground();
    const queryHistoryBackgroundLight = await app.driver.getQueryHistoryBackground();

    // WHEN the computer appearance is changed from Light to Dark theme.
    await app.driver.setTheme("dark");
    // Re-run the query to have the field styles refresh.
    await app.setQuery("{}");
    await app.clickRunQuery();

    // THEN Query Results and Query History fields should show dark background colour.
    const queryResultBackgroundDark = await app.driver.getQueryResultBackground();
    const queryHistoryBackgroundDark = await app.driver.getQueryHistoryBackground();

    expect(queryResultBackgroundDark).to.not.equal(queryResultBackgroundLight);
    expect(queryHistoryBackgroundDark).to.not.equal(queryHistoryBackgroundLight);
  });
});
