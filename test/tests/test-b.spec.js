const assert = require('assert');
const request = require('request-promise');
const config = require('../config');

const restUrl = `http://localhost:${config.REST_PORT}`;
const pubsubUrl = `http://localhost:${config.PUBSUB_PORT}`;

function publishMessage(channel, payload, metadata) {
    return request({
        method: 'POST',
        uri: `${pubsubUrl}/publish`,
        json: true,
        body: {channel, payload, metadata}
    })
}

function getAppointments(specialty, date) {
    return request({
        uri: `${restUrl}/appointments`,
        qs: {specialty, date},
        json: true
    })
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

const supermanProvider = {
    name: "Clark Kent",
    score: 1000,
    specialties: [
        "Supertreatment"
    ],
    availableDates: [
        {
            from: 814172400000,
            to: 814172400000
        }
    ]
};

function addSuperman() {
    const specialty = supermanProvider.specialties[0];
    const date = supermanProvider.availableDates[0].to;
    return publishMessage(`addProvider`, supermanProvider)
        .then(() => wait(100))
        .then(() => getAppointments(specialty, date))
        .then(result => assert.deepStrictEqual(result, [supermanProvider.name]));
}

function removeSuperman() {
    const specialty = supermanProvider.specialties[0];
    const date = supermanProvider.availableDates[0].to;
    return publishMessage(`deleteProvider`, {name: supermanProvider.name})
        .then(() => wait(100))
        .then(() => getAppointments(specialty, date))
        .then(result => assert.deepStrictEqual(result, []));
}


describe(`# Test part B of the coding interview`, () => {
    describe(`# Test addProvider`, () => {
        afterEach(removeSuperman);

        it(`# Should add a provider`, addSuperman);

        it(`# Should update a provider`, () => {
            const differentSuperman = {
                name: "Clark Kent",
                score: 1000,
                specialties: [
                    "Measles"
                ],
                availableDates: [
                    {
                        from: 2524633200000,
                        to: 2524640400000
                    }
                ]
            };
            return addSuperman()
                .then(() => publishMessage(`addProvider`, differentSuperman))
                .then(() => wait(100))
                .then(() => getAppointments(supermanProvider.specialties[0], supermanProvider.availableDates[0].to))
                .then(result => assert.deepStrictEqual(result, []))
                .then(() => getAppointments(differentSuperman.specialties[0], differentSuperman.availableDates[0].to))
                .then(result => assert.deepStrictEqual(result, [differentSuperman.name]));
        })
    });

    describe(`# Test deleteProvider`, () => {
        // Make sure we have a provider to delete
        before(addSuperman);

        // Make sure the provider is deleted no matter what happened in the test
        after(removeSuperman);

        it(`# Should delete a provider`, () => {
            return publishMessage(`deleteProvider`, {name: supermanProvider.name})
                .then(() => wait(100))
                .then(() => getAppointments(supermanProvider.specialties[0], supermanProvider.availableDates[0].to))
                .then(result => assert.deepStrictEqual(result, []));
        });
    });

    describe(`# Test updateTimeslots`, () => {
        // Make sure we have a provider to update
        before(addSuperman);

        //cleanup;
        after(removeSuperman);

        it(`# Should update available dates`, () => {
            const timeBeforeUpdate = supermanProvider.availableDates[0].to;
            const timeAfterUpdate = 656406000000;
            const providerToUpdate = {
                name: supermanProvider.name, availableDates: [
                    {
                        from: timeAfterUpdate,
                        to: timeAfterUpdate
                    }
                ]
            };
            const specialty = supermanProvider.specialties[0];

            // First validate the existence of the provider before the update
            return getAppointments(specialty, timeBeforeUpdate)
                .then(result => assert.deepStrictEqual(result, [supermanProvider.name]))
                .then(() => getAppointments(specialty, timeAfterUpdate))
                .then(result => assert.deepStrictEqual(result, []))

                // Make the update
                .then(() => publishMessage('updateTimeslots', providerToUpdate))
                .then(() => wait(100))

                // Make sure the provider was changed
                .then(() => getAppointments(specialty, timeBeforeUpdate))
                .then(result => assert.deepStrictEqual(result, []))
                .then(() => getAppointments(specialty, timeAfterUpdate))
                .then(result => assert.deepStrictEqual(result, [providerToUpdate.name]))
        });
    })
});