/**
 * Implement these to make the tests pass.
 * Each of these functions are expected to use the orchestrator to run a picture through a pipeline, with different
 * algorithms for each pipeline
 */

const orchestrator = require('./orchestrator');
orchestrator.init();
orchestrator.registerAlgorithm('invertBrightness', picture => picture.map(row => row.map(pixel => 255 - pixel)));

function invertBrightness(picture) {
    return orchestrator.runPipeline(picture, ['invertBrightness']);
}

function invertHorizontally(picture) {
    throw new Error('Unimplemented');
}

function averagePixels(picture) {
    throw new Error('Unimplemented');
}

function runAllAlgorithms(picture) {
    throw new Error('Unimplemented');
}

module.exports = {invertBrightness, invertHorizontally, averagePixels, runAllAlgorithms};