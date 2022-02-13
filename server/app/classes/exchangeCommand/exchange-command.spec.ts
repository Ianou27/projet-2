import { CaseProperty } from '@common/assets/case-property';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { ExchangeCommand } from './exchange-command';

describe('Exchange Command', () => {
    let game: Game;
    const lettersTilePlayer1: Tile[] = [];
    const hisTurn = true;
    const letters = ['A', 'A', 'A', 'B', 'B', 'B', '*'];
    for (const letter of letters) {
        const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
        tile1.addLetter(letter);
        lettersTilePlayer1.push(tile1);
    }

    beforeEach(() => {
        game = new Game();
        game.player1 = new Player(lettersTilePlayer1, hisTurn);
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

    it('method exchangeLetters should only exchange letters mention', () => {
        const commandValid = '!echanger aa';
        const lettersRemainingExpect = ['A', 'B', 'B', 'B', '*'];
        ExchangeCommand.exchangeLetters(commandValid.split(' '), game);
        const lettersPlayer = game.player1.lettersToStringArray();
        lettersPlayer.splice(0, 2);
        expect(lettersRemainingExpect).to.eql(lettersPlayer);
    });

    it('method exchangeLetters should only exchange * if mentions with a capital letter', () => {
        const commandValid = '!echanger *';
        const lettersRemainingExpect = ['A', 'A', 'A', 'B', 'B', 'B'];
        ExchangeCommand.exchangeLetters(commandValid.split(' '), game);
        const lettersPlayer = game.player1.lettersToStringArray();
        lettersPlayer.pop();
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
