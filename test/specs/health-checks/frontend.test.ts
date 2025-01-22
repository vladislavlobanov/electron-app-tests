import { expect } from 'chai';
import { browser } from "@wdio/globals";

describe('Frontend health check', () => {
    it('should return up state', () => {
        const appWrapper = browser.$('div#root')

        expect(appWrapper).exist;
    })
})