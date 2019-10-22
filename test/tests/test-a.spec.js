const assert = require('assert');
const request = require('request-promise');
const config = require('../config');

const restUrl = `http://localhost:${config.REST_PORT}`;
const pubsubUrl = `http://localhost:${config.PUBSUB_PORT}`;

function getAppointments(specialty, date) {
    return request({
        uri: `${restUrl}/appointments`,
        qs: {specialty, date}
    })
}

describe(`# Test part A of the coding interview`, () => {
    before(() => request(`${pubsubUrl}/reset`));

    describe(`# Test GET /appointments`, () => {
            it(`# Should get a provider with matching specialty and date`, () =>
                getAppointments('Neuropathy', '2019-10-20T14:00+02')
                    .then(result => assert.strictEqual(result, ['Suzanna Dean'])))
        }
    )
});