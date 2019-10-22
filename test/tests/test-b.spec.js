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

describe(`# Test part B of the coding interview`, () => {
    describe(`# Test addProvider`, () => {
        it(`# Should add a provider`, () => {
            const providerToAdd = {
                name: "Clark Kent",
                score: 1000,
                specialties: [
                    "Supertreatment"
                ],
                availableDates: [
                    {
                        gte: "2050-01-01T08:00+0100",
                        lte: "2050-01-01T10:00+0100"
                    }
                ]
            };
            return publishMessage(`addProvider`, providerToAdd)
                .then(() => wait(500))
                .then(() => getAppointments(`Supertreatment`, `2050-01-01T08:00+0100`))
                .then(result => assert.deepStrictEqual(result, ['Clark Kent']))
        });

        it(`# Should update a provider`, () => {
            const providerToAdd = {
                name: "Clark Kent",
                score: 1000,
                specialties: [
                    "Measles"
                ],
                availableDates: [
                    {
                        gte: "2050-01-01T08:00+0100",
                        lte: "2050-01-01T10:00+0100"
                    }
                ]
            };
            return publishMessage(`addProvider`, providerToAdd)
                .then(() => wait(300))
                .then(() => getAppointments(`Supertreatment`, `2050-01-01T08:00+0100`))
                .then(result => assert.deepStrictEqual(result, []))
                .then(() => getAppointments(`Measles`, `2050-01-01T08:00+0100`))
                .then(result => assert.deepStrictEqual(result, ["Clark Kent"]))
        })
    });

    describe(`# Test deleteProvider`, () => {
        it(`# Should delete a provider`, () => {
            const providerToDelete = {name: 'Randall Flagg', specialty: 'Physiologist', date: '2027-04-29T08:00+0100'};
            return getAppointments(providerToDelete.specialty, providerToDelete.date)
                .then(result => assert.deepStrictEqual(result, [providerToDelete.name]))
                .then(() => publishMessage(`deleteProvider`, {name: providerToDelete.name}))
                .then(() => wait(300))
                .then(() => getAppointments(providerToDelete.specialty, providerToDelete.date))
                .then(result => assert.deepStrictEqual(result, []));
        });
    })

    describe(`# Test updateTimeslots`, () => {
        it(`# Should update available dates`, () => {
            const timeBeforeUpdate = "1995-10-20T08:00+0100";
            const timeAfterUpdate = "1990-10-20T08:00+0100";
            const providerToUpdate = {
                name: 'Oy Midworld', availableDates: [
                    {
                        gte: timeAfterUpdate,
                        lte: timeAfterUpdate
                    }
                ]
            };
            return getAppointments('Neonatal', timeBeforeUpdate)
                .then(result => assert.deepStrictEqual(result, [providerToUpdate.name]))
                .then(() => getAppointments('Neonatal', timeAfterUpdate))
                .then(result => assert.deepStrictEqual(result, []))
                .then(() => publishMessage(`updateTimeslots`, providerToUpdate))
                .then(() => wait(300))
                .then(() => getAppointments('Neonatal', timeBeforeUpdate))
                .then(result => assert.deepStrictEqual(result, []))
                .then(() => getAppointments('Neonatal', timeAfterUpdate))
                .then(result => assert.deepStrictEqual(result, [providerToUpdate.name]))
        });
    })
});