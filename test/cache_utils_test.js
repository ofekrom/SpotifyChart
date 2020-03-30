const {expect} = require('chai');
const sut = require('../cache/cacheUtils');

describe('test cache utils generateCacheKeyWithParams', () => {
    it('when cadence is not set', () => {
        expect(sut.generateCacheKeyWithParams('regional', '', 'latest', 'ch')).to.be.equal('regional__latest_ch');
    });
    it('when params are valid', () => {
        expect(sut.generateCacheKeyWithParams('regional', 'daily', 'latest', 'ch')).to.be.equal('regional_daily_latest_ch');
    });
});