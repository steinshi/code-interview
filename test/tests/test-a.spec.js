const assert = require('assert');
const request = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

const restUrl = `http://localhost:${config.REST_PORT}`;
const pubsubUrl = `http://localhost:${config.PUBSUB_PORT}`;

function getAppointments(specialty, date) {
    return request({
        uri: `${restUrl}/appointments`,
        qs: {specialty, date},
        json: true
    })
}

function postAppointment(name, date) {
    return request({
        uri: `${restUrl}/appointments`,
        method: 'POST',
        body: {name, date},
        json: true,
    })
}

describe(`# Test part A of the coding interview`, () => {
    before(() => request(`${pubsubUrl}/reset`));
    after(() => request(`${pubsubUrl}/reset`));

    describe(`# Test GET /appointments`, () => {
            it(`# Should get a provider that has a matching specialty and date`, () =>
                getAppointments('Neuropathy', '2019-10-20T14:00+02')
                    .then(result => assert.deepStrictEqual(result, ['Susannah Dean'])));

            it(`# Should get a provider that has a matching specialty and date, specialty isn't case sensitive`, () =>
                getAppointments('neuropathy', '2019-10-20T14:00+02')
                    .then(result => assert.deepStrictEqual(result, ['Susannah Dean'])));

            it(`# Should get several providers that have matching specialty and date ordered by score`, () =>
                getAppointments('Cardiologist', '2019-10-21T10:01+04')
                    .then(result => assert.deepStrictEqual(result, ['Roland Deschain', 'Jake Chambers'])));

            it(`# Should not get a provider if they do not have a matching time slot, even if they have matching specialty`, () =>
                getAppointments('Internist', '2019-10-21T10:01+04')
                    .then(result => assert.deepStrictEqual(result, [])));

            it(`# Should not get a provider if they do not have a matching specialty, even if they have matching time slots`, () =>
                getAppointments('Internist', '2020-05-20T23:00-09')
                    .then(result => assert.deepStrictEqual(result, [])));

            it(`# Should get a provider that has a matching specialty and date even if given a different time zone`, () =>
                getAppointments('Physiologist', '2027-04-29T10:00+03')
                    .then(result => assert.deepStrictEqual(result, ['Randall Flagg'])));

            it(`# Should return code 400 if no specialty was supplied`, () =>
                getAppointments('', '2027-04-29T10:00+03')
                    .then(() => assert.fail(`Promise should've rejected!`))
                    .catch(error => assert.deepStrictEqual(error.statusCode, 400)));

            it(`# Should return code 400 if bad date format was supplied`, () =>
                getAppointments('Physiologist', '2027-99-29T10:00+03')
                    .then((result) => assert.fail(`Promise should've rejected!`))
                    .catch(error => assert.deepStrictEqual(error.statusCode, 400)));
        }
    );

    describe(`# Test POST /appointments`, () => {
        let handler;
        let server;

        function subscribeToNewAppointments() {
            const app = express();
            const port = config.SUBSCRIBER_PORT;
            app.use(bodyParser.json());
            app.route('/newAppointment').post((request, response) => handler ? handler(request.body) : response.status(200).send());
            server = app.listen(port);
            return request({
                method: 'POST',
                uri: `${pubsubUrl}/subscribe`,
                body: {channel: 'newAppointments', address: `http://localhost:${port}/newAppointment`},
                json: true
            })
        }

        function shutDownSubscriber() {
            server.close();
        }

        before(subscribeToNewAppointments);
        beforeEach(() => handler = null);
        after(shutDownSubscriber);

        it(`# should return 400 when providing name and date that don't have an availability`, done => {
            handler = () => {
                done(new Error(`Expected postAppointment to throw error and not reach this stage!`));
            };
            postAppointment("Roland Deschain", "2027-04-29T08:00+0100")
                .then(() => done(new Error(`Expected postAppointment to throw error and not reach this stage!`)))
                .catch(error => done(assert.deepStrictEqual(error.statusCode, 400)));
        });

        it(`# should successfully update an appointment and return code 200`, () =>
            postAppointment("Roland Deschain", "2019-10-20T13:00+0200")
        );

        it(`# should successfully update an appointment and publish the appointment to the pubsub`, done => {
                handler = (message) => {
                    if (message.payload.name === "Roland Deschain" && message.payload.date === "2019-10-20T13:00+0200") done();
                    else done(new Error(`Unexpected message received from pubsub: ${JSON.stringify(message)}`));
                };
                postAppointment("Roland Deschain", "2019-10-20T13:00+0200")
                    .catch(done);
            }
        )
    })
});