const assert = require('assert');
const pipeline = require('../pipeline/pipeline');

describe('# pipeline tests', () => {
    it('# runs a picture through all algorithms', () => {
        const before = [[100, 23], [230, 1]];
        const expected = [[155, 232], [25, 254]];
        return pipeline.runAllAlgorithms(before)
            .then(after => assert.deepStrictEqual(after, expected))
    })
});
