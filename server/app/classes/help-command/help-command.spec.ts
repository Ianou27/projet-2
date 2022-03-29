import { expect } from 'chai';
import { HelpCommand } from './help-command';

describe('Pass Command', () => {
    it('method validatedFormat should return false if it is not one term', () => {
        const commandNotValid = '!aide a';
        const validation = HelpCommand.validatedFormat(commandNotValid.split(' '));
        expect(validation).to.equal(false);
    });

    it('method validatedFormat should return true if it is one term', () => {
        const commandNotValid = '!aide';
        const validation = HelpCommand.validatedFormat(commandNotValid.split(' '));
        expect(validation).to.equal(true);
    });
});
