import { expect } from 'chai';
import { HelpCommand } from './help-command';

describe('Reserve Command', () => {
    const command = ['!aide'];

    it('reserve should return true if the command format is correct', () => {
        expect(HelpCommand.verifyFormat(command)).to.equal(true);
    });

    it('reserve should return false if the command format is incorrect', () => {
        expect(HelpCommand.verifyFormat(['adada'])).to.equal(false);
    });

    it('reserve should return false if the command his longer than 1', () => {
        expect(HelpCommand.verifyFormat(['!aide', '1234'])).to.equal(false);
    });
});
