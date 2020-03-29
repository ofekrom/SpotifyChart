const ApiResponse = Object.freeze({
    OK:	{ statusCode: 200, message: 'success' },
    GeneralError:	{ statusCode: 500, message: 'Error occurred' },
    BadRequest: { statusCode: 400, message: 'Invalid request' },
    AuthenticationFailure: { statusCode: 401, message: 'Authentication failed' },
    AuthorizationFailure: { statusCode: 403, message: 'Forbidden' },
    NotFound: { statusCode: 404, message: 'Resource not found' },
    Conflict: { statusCode: 409, message: 'Conflict' }
});

Object.assign(module.exports, {
    ApiResponse
});
