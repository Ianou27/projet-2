import { CaseProperty } from '@common/assets/case-property';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { ExchangeCommand } from './exchange-command';

describe('Exchange Command', () => {
    let game: Game = new Game();
    let lettersTilePlayer1: Tile[] = [];
    const letters = ['A', 'A', 'A', 'B', 'B', 'B', '*'];

    beforeEach(() => {
        game = new Game();
        for (const letter of letters) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.addLetter(letter);
            lettersTilePlayer1.push(tile1);
        }
        game.player1.letters = lettersTilePlayer1;
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
        game.reserveLetters = ['a', 'b', 'c'];
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
        game.reserveLetters = ['C', 'C', 'C', 'C', 'C', 'C', 'C'];
        ExchangeCommand.exchangeLetters(commandValid.split(' '), game);
        const lettersPlayer = game.player1.lettersToStringArray();
        expect(lettersRemainingExpect).to.eql(lettersPlayer);
    });

    it('method exchangeLetters should be able to change an occurrence of a letter', () => {
        const commandValid = '!echanger a';
        const lettersRemainingExpect = ['D', 'A', 'A', 'B', 'B', 'B', '*'];
        game.reserveLetters = ['D', 'D', 'D', 'D', 'D', 'D', 'D'];
        ExchangeCommand.exchangeLetters(commandValid.split(' '), game);
        const lettersPlayer = game.player1.lettersToStringArray();
        expect(lettersRemainingExpect).to.eql(lettersPlayer);
    });

    it('method exchangeLetters should not change the number of letters in the reserve', () => {
        const commandValid = '!echanger aab';
        const initialNumberLetters = game.reserveLetters.length;
        ExchangeCommand.exchangeLetters(commandValid.split(' '), game);
        const finalNumberLetters = game.reserveLetters.length;
        expect(initialNumberLetters).to.equal(finalNumberLetters);
    });
});
