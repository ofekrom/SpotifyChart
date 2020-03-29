const { get } = require('lodash');

class ApiError extends Error {
    constructor (statusCode, message, reason, code, logMessage, identifiers) {
        super(message || get(statusCode, 'message'));

        if (message instanceof Error) {
            this.stack = message.stack;
        }

        this.statusCode = get(statusCode, 'statusCode');
        this.reason = reason;
        this.code = code;
        this.logMessage = logMessage;
        this.identifiers = identifiers;
    }
}

;

Object.assign(module.exports, {
    ApiError
});