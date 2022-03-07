import { expect } from 'chai';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { PassCommand } from './pass-command';

describe('Pass Command', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game();
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'rt', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'rta', id: '2', room: 'room1' });
    });

    it('method validatedPassCommandFormat should return false if it is not one term', () => {
        const commandNotValid = '!passer a';
        const validation = PassCommand.validatedPassCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equal(false);
    });
});
