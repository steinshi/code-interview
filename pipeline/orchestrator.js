const uuid = require('uuid/v4');
const pubsub = require('../pubsub');

const runningPipelines = {};
const availableAlgorithms = {};
const RESULT_CHANNEL = 'pipeline_result';

function runPipeline(picture, algorithms, timeout = 5000) {
    const id = uuid();
    runningPipelines[id] = { algorithms };
    const promise = new Promise((resolve, reject) =>  {
        timeout = timeout ? timeout : 0;
        setTimeout(() => reject(`timeout of ${timeout} reached`), timeout);
        runningPipelines[id].resolve = picture => resolve(picture);
    });
    pubsub.publish(algorithms[0], picture, { id });
    return promise;
}

function registerAlgorithm(name, handler) {
    availableAlgorithms[name] = handler;
    pubsub.subscribe(name, (picture, meta) => {
        if (runningPipelines[meta.id]) {
            const remainingAlgorithms = runningPipelines[meta.id].algorithms;
            const processedPicture = handler(picture);
            remainingAlgorithms.shift();
            if (remainingAlgorithms.length === 0) {
                pubsub.publish(RESULT_CHANNEL, processedPicture, meta);
            } else {
                pubsub.publish(remainingAlgorithms[0], processedPicture, meta)
            }
        }
    })
}

function init() {
    pubsub.subscribe(RESULT_CHANNEL, (picture, meta) => {
        const currentRun = runningPipelines[meta.id];
        if (currentRun) {
            currentRun.resolve(picture);
            delete runningPipelines[meta.id];
        }
    })
}

module.exports = { init, registerAlgorithm, runPipeline };
