const {expect} = require('chai');
const sut = require('../utils/chartUtils');

describe('test chart URL', () => {
    it('when type is not set', () => {
        expect(sut.buildChartURL('', 'daily', 'latest', 'ch')).to.be.equal('https://spotifycharts.com//ch/daily/latest/download');
    });
    it('when params are valid', () => {
        expect(sut.buildChartURL('regional', 'daily', 'latest', 'ch')).to.be.equal('https://spotifycharts.com/regional/ch/daily/latest/download');
    });
});