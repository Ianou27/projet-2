import { expect } from 'chai';
import { LetterScore } from './../../../../common/assets/reserve-letters';
import { HelpCommand } from './help-command';

describe('Reserve Command', () => {
    let reserve: string[];
    const command = ['!aide'];

    beforeEach(() => {
        reserve = ['*', 'A', 'B', 'B', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'];
    });

    it('reserve should return true if the command format is correct', () => {
        expect(HelpCommand.verifyFormat(command)).to.equal(true);
    });

    it('reserve should return false if the command format is incorrect', () => {
        expect(HelpCommand.verifyFormat(['adada'])).to.equal(false);
    });

    it('reserve should return false if the command his longer than 1', () => {
        expect(HelpCommand.verifyFormat(['!aide 1234'])).to.equal(false);
    });

    it('reserve should return a dictionnary with the right keys and values', () => {
        const dict: LetterScore = HelpCommand.reserve(reserve);
        expect(dict.A).to.equal(1);
        expect(dict['*']).to.equal(1);
        expect(dict.B).to.equal(2);
        expect(dict.C).to.equal(1);
    });

    it('reserve should not have letters not in the reserve Array', () => {
        const dict: LetterScore = HelpCommand.reserve(reserve);
        expect(dict.E).to.equal(undefined);
    });

    it('reserve should have the right count of letters', () => {
        const dict: LetterScore = HelpCommand.reserve(reserve);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(dict.D).to.equal(8);
    });
});
