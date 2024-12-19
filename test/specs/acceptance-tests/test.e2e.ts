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
        assert.include(resultText, '[]', 'Query result should start with []"');

    });
});
