const assert = require('assert');
const pipeline = require('../pipeline/pipeline');

describe('# pipeline tests', () => {
        describe('# invert brightness tests', () => {
            it('# inverts brightness for even-dimesion square picture', () => {
                const before = [[100,23],[230,1]];
                const expected = [[155,232],[25,254]];
                return pipeline.invertBrightness(before).then(after => assert.deepStrictEqual(after, expected))
            })
        });
    }
);
