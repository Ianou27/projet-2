import { expect } from 'chai';
import { LetterScore } from './../../../../common/assets/reserve-letters';
import { ReserveCommand } from './reserve-command';

describe('Reserve Command', () => {
    let reserve: string[];
    const command = ['!réserve'];

    beforeEach(() => {
        reserve = ['*', 'A', 'B', 'B', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'];
    });

    it('reserve should return true if the command format is correct', () => {
        expect(ReserveCommand.verifyFormat(command)).to.equal(true);
    });

    it('reserve should return false if the command format is incorrect', () => {
        expect(ReserveCommand.verifyFormat(['adada'])).to.equal(false);
    });

    it('reserve should return false if the command his longer than 1', () => {
        expect(ReserveCommand.verifyFormat('!réserve 1234'.split(' '))).to.equal(false);
    });

    it('reserve should return a dictionnary with the right keys and values', () => {
        const dict: LetterScore = ReserveCommand.reserve(reserve);
        expect(dict.A).to.equal(1);
        expect(dict['*']).to.equal(1);
        expect(dict.B).to.equal(2);
        expect(dict.C).to.equal(1);
    });

    it('reserve should not have letters not in the reserve Array', () => {
        const dict: LetterScore = ReserveCommand.reserve(reserve);
        expect(dict.E).to.equal(undefined);
    });

    it('reserve should have the right count of letters', () => {
        const dict: LetterScore = ReserveCommand.reserve(reserve);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(dict.D).to.equal(8);
    });
});
