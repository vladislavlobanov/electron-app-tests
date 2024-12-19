import { browser } from '@wdio/globals'
import { assert } from 'chai';

 
describe('MongoDB Query Execution Test', () => {
    it('should execute a simple query and display results', async () => {
        const queryInput = await browser.$('.card-body textarea');
        await queryInput.setValue('{}');

        const runButton = await browser.$('.btn.btn-primary.btn-block');
        await runButton.click();

        const resultElement = await browser.$('.card-body pre');
        const resultText = await resultElement.getText();

        assert.notInclude(resultText, 'Invalid Query', 'Query result should not contain "Invalid Query"');
        const expectedText = JSON.stringify([
          { _id: "676411590110e98fa92337a1", name: "test1", value: 1 },
          { _id: "676411590110e98fa92337a2", name: "test2", value: 2 },
          { _id: "676411590110e98fa92337a3", name: "test3", value: 3 },
        ], null, 2);
        assert.include(resultText, expectedText, 'Query result should match');

    });
});
