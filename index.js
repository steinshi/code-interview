const pubsub = require('./pubsub');

pubsub.subscribe('channel', (payload, metadata) => {
    console.log('payload: ', payload);
    console.log('metadata', metadata);
});

pubsub.publish('channel', [[1,2],[3,4]], {user: "yuval"});
