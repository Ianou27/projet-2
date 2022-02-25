import { expect } from 'chai';
import { ReserveLetters } from './reserve-letters';

describe('ReserveLetters', () => {
    let reserve: ReserveLetters;

    beforeEach(() => {
        reserve = new ReserveLetters();
    });

    it('should create an instance', () => {
        expect(typeof reserve).to.equal('object');
    });

    it('should create a reserve of 102 letters', () => {
        expect(reserve.letters.length).to.equal(102);
    });
});
