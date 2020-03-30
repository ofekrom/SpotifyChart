const {expect} = require('chai');
const logger = require('cwt-logger').getAppLogger();
const {mockCwtLogger} = require('cwt-schmock');

const validNotificationRequest = require('./fixtures/validNotification');
const invalidPushSchema = require('./fixtures/invalidPushSchema');
const invalidNotificationName = require('./fixtures/invalidNotificationName');
const invalidNotificationFeatureName = require('./fixtures/invalidNotificationFeatureName');

let sut = require('../lib/services/validateNotificationPropertiesService');

describe('validate notification properties', () => {
    mockCwtLogger(logger);
    before(function () {
        this.timeout(5000);
    });
    describe('when notification push schema is invalid', () => {
        it('should throw an exception', () => {
            expect(sut.validate.bind(null, invalidPushSchema)).to.throw("notification push schema not supported");
        });
    });

    describe('when notification name is not permitted', () => {
        it('should throw an exception', () => {
            expect(sut.validate.bind(null, invalidNotificationName)).to.throw("this notification name is not permitted");
        });
    });
    describe('when notification feature name is not permitted', () => {
        it('should throw an exception', () => {
            expect(sut.validate.bind(null, invalidNotificationFeatureName)).to.throw("this notification feature name is not permitted");
        });
    });

    describe('when notification is valid', () => {
        it('should not throw an exception', () => {
            expect(sut.validate.bind(null, validNotificationRequest)).to.not.throw();
        });
    });
});