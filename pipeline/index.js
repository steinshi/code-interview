const orchestrator = require('./orchestrator');

orchestrator.registerAlgorithm('identity', picture => {console.log('Hi'), picture});
orchestrator.runPipeline([[1,2]], ['identity','identity']);
