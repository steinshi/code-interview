const request = require('request-promise');

function sendToListener(listener, payload, metadata) {
    if (!listener.startsWith('http')) listener = `http://${listener}`;
    return request({
        method: 'POST',
        uri: listener,
        body: { payload, metadata },
        json: true
    })
}

module.exports = {sendToListener};
