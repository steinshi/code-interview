const handlers = {};

function subscribe(channel, handler) {
    if (!handlers[channel]) {
        handlers[channel] = [];
    }
    handlers[channel].push(handler);
}


function publish(channel, payload, metadata) {
    if (handlers[channel]) {
        handlers[channel].forEach(handler => handler(payload, metadata))
    }
}

module.exports = { subscribe, publish };
