import { Timer } from '@app/services/timer-manager.service';
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { ExchangeCommand } from './exchange-command';

describe('Exchange Command', () => {
    let game: Game = new Game();
    let lettersTilePlayer1: Tile[] = [];
    const letters = ['A', 'A', 'A', 'B', 'B', 'B', '*'];

    beforeEach(() => {
        game = new Game();
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'rt', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player2', { username: 'aa', id: '2', room: 'room1' });
        for (const letter of letters) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letter;
            tile1.value = letterValue[letter];
            lettersTilePlayer1.push(tile1);
        }
        game.player1.letters = lettersTilePlayer1;
        game.timer = new Timer('60');
    });

    afterEach(() => {
        lettersTilePlayer1 = [];
    });

    it('method validatedExchangeCommandFormat should return false if its not starting with a !', () => {
        const commandNotValid = 'echanger aaabbb';
        const validation = ExchangeCommand.validatedExchangeCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equals(false);
    });

    it('method validatedExchangeCommandFormat should return false if its not compose of 2 terms', () => {
        const commandNotValid = '!echanger aaabbbbcccc aa';
        const validation = ExchangeCommand.validatedExchangeCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equals(false);
    });

    it('method validatedExchangeCommandFormat should return true if it correspond to the format of an exchange', () => {
        const commandNotValid = '!echanger aabb';
        const validation = ExchangeCommand.validatedExchangeCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equals(true);
    });

    it('method validatedExchangeCommandBoard should return false if the reserve has less than 7 letters', () => {
        const commandNotValid = '!echanger aabb';
        game.reserveLetters.letters = ['a', 'b', 'c'];
        const validation = ExchangeCommand.validatedExchangeCommandBoard(commandNotValid.split(' '), game);
        expect(validation).to.equals(false);
    });

    it('method validatedExchangeCommandBoard should return false if the player try to exchange letters he doesnt have', () => {
        const commandNotValid = '!echanger zaa';
        const validation = ExchangeCommand.validatedExchangeCommandBoard(commandNotValid.split(' '), game);
        expect(validation).to.equals(false);
    });

    it('method validatedExchangeCommandBoard should return true if it contains letters of the player and the reserve has more than 7 letters', () => {
        const commandValid = '!echanger aaabb*';
        const validation = ExchangeCommand.validatedExchangeCommandFormat(commandValid.split(' '));
        expect(validation).to.equals(true);
    });

    it('method exchangeLetters should be able to change *', () => {
        const commandValid = '!echanger *';
        const lettersRemainingExpect = ['A', 'A', 'A', 'B', 'B', 'B', 'C'];
        game.reserveLetters.letters = ['C', 'C', 'C', 'C', 'C', 'C', 'C'];
        game.exchangeLetters(commandValid.split(' '));
        const lettersPlayer = game.player1.lettersToStringArray();
        expect(lettersRemainingExpect).to.eql(lettersPlayer);
    });

    it('method exchangeLetters should be able to change an occurrence of a letter', () => {
        const commandValid = '!echanger a';
        const lettersRemainingExpect = ['D', 'A', 'A', 'B', 'B', 'B', '*'];
        game.reserveLetters.letters = ['D', 'D', 'D', 'D', 'D', 'D', 'D'];
        game.exchangeLetters(commandValid.split(' '));
        const lettersPlayer = game.player1.lettersToStringArray();
        expect(lettersRemainingExpect).to.eql(lettersPlayer);
    });

    it('method exchangeLetters should not change the number of letters in the reserve', () => {
        const commandValid = '!echanger aab';
        const initialNumberLetters = game.reserveLetters.letters.length;
        game.exchangeLetters(commandValid.split(' '));
        const finalNumberLetters = game.reserveLetters.letters.length;
        expect(initialNumberLetters).to.equal(finalNumberLetters);
    });
});
