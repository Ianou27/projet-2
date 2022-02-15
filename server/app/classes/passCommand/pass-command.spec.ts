import { expect } from 'chai';
import { Game } from './../game/game';
import { PassCommand } from './pass-command';

describe('Pass Command', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
    });

    it('method validatedPassCommandFormat should return false if it is not one term', () => {
        const commandNotValid = '!passer a';
        const validation = PassCommand.validatedPassCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equal(false);
    });

    it('method passTurn should change turn', () => {
        expect(game.player1.getHisTurn()).to.equal(true);
        expect(game.player2.getHisTurn()).to.equal(false);
        PassCommand.passTurn(game);
        expect(game.player1.getHisTurn()).to.equal(false);
        expect(game.player2.getHisTurn()).to.equal(true);
    });
});
