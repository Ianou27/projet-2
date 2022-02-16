import { assert, expect } from 'chai';
import * as sinon from 'sinon';
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

    it('method passTurn should change turn and call verifyGameState', () => {
        const spy = sinon.spy(game, 'verifyGameState');
        expect(game.player1.getHisTurn()).to.equal(true);
        expect(game.player2.getHisTurn()).to.equal(false);
        PassCommand.passTurn(game);
        expect(game.player1.getHisTurn()).to.equal(false);
        expect(game.player2.getHisTurn()).to.equal(true);
        assert(spy.called);
    });
});
