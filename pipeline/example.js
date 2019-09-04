const orchestrator = require('./orchestrator');

orchestrator.init();
orchestrator.registerAlgorithm('identity', picture => picture);
orchestrator.registerAlgorithm('makeZero', picture => picture.map(row => row.map(() => 0)));
orchestrator.runPipeline([[1,2]], ['identity','makeZero'])
    .then(console.log)
    .catch(console.error);
