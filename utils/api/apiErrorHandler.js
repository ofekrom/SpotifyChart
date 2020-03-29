const { get, isEmpty, omitBy, isNil } = require('lodash');
//TODO do I need this class?
const removeEmpty = (obj) => (omitBy(obj, isNil));
const { ApiError } = require('./apiError');

const toApiError = (err, identifiers) => (
    (err instanceof ApiError) ? err : new ApiError(err.statusCode, err.message, err.reason, err.code, err.logMessage, identifiers)
);

const logError = (err, identifiers) => {
    const logMessage = get(err, 'logMessage');
    const errIdentifiers = get(err, 'identifiers');
    const actualIdentifier = errIdentifiers || identifiers;
    const message = logMessage || get(err, 'message');
    const cleaned = removeEmpty(actualIdentifier);

    isEmpty(cleaned) ? console.error(message) : console.error(cleaned, message);
};

const handleError = (next, err, identifiers) => {
    const actualErr = (err instanceof ApiError || err instanceof Error) ? err : toApiError(err, identifiers);

    logError(actualErr, identifiers);

    return next(actualErr);
};

const throwCustomError = (customError, identifiers, logerror = false) => {
    if (logerror) logError(customError, identifiers);

    throw toApiError(customError, identifiers);
};

Object.assign(module.exports, {
    handleError,
    throwCustomError
});
