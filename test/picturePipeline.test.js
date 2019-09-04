const assert = require('assert');
const {invertColor} = require('../picturePipeline/algorithms/inversion');

describe('# algorithm tests', () => {
    it('# inversion test for 2x2 picture', () => {
        const pictureBefore = [[1,200],[100,50]];
        const pictureAfter = [[254, 55], [155, 205]];

        const result = invertColor(pictureBefore); //TODO: COMPLETE ME

        assert.deepEqual(result, pictureAfter);
    });
});
