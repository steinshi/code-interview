const uuid = require('uuid/v4');
const pubsub = require('../pubsub');

const runningPipelines = {};
const availableAlgorithms = {};

function runPipeline(picture, algorithms) {
    const id = uuid();
    runningPipelines[id] = algorithms;
    pubsub.publish(algorithms[0], picture, { id })
}

function registerAlgorithm(name, handler) {
    availableAlgorithms[name] = handler;
    pubsub.subscribe(name, (picture, meta) => {
        const remainingAlgorithms = runningPipelines[meta.id];
        if (remainingAlgorithms) {
            const processedPicture = handler(picture);
            remainingAlgorithms.shift();
            if (remainingAlgorithms === []) {
                return processedPicture;
            } else {
                pubsub.publish(remainingAlgorithms[0], processedPicture, meta)
            }
        }
    })
}

module.exports = { registerAlgorithm, runPipeline };
