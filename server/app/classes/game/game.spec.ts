import { GameBoardService } from '@app/services/gameBoard.service';
import { CaseProperty } from '@common/assets/case-property';
import { Tile } from '@common/tile/Tile';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './game';

describe('Game', () => {
    let game: Game;
    const numberLetterReserveMinusPlayerLetters = 88;
    const letters = ['A', 'C', 'A', 'Z', 'B', 'R', '*'];
    const lettersTilePlayer1: Tile[] = [];
    for (const letter of letters) {
        const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
        tile1.addLetter(letter);
        lettersTilePlayer1.push(tile1);
    }

    beforeEach(() => {
        game = new Game();
    });

    it('constructor should construct a game with two players named player1 and player2', () => {
        expect(game.player1.name).equal('player1');
        expect(game.player2.name).equal('player2');
    });

    it('constructor should construct a game with a gameBoard object', () => {
        expect(game.gameBoard).instanceOf(GameBoardService);
    });

    it('constructor should initialize the reserve', () => {
        const reserveInitialLength = game.reserveLetters.length;
        expect(reserveInitialLength).equal(numberLetterReserveMinusPlayerLetters);
    });

    it('method changeTurnTwoPlayers should change the turn of the two player', () => {
        const turnPlayer1 = game.player1.hisTurn;
        const turnPlayer2 = game.player2.hisTurn;
        game.changeTurnTwoPlayers();
        expect(turnPlayer1).equal(!game.player1.hisTurn);
        expect(turnPlayer2).equal(!game.player2.hisTurn);
    });

    it('method playerTurn should return the player whose turn it is', () => {
        const playerTurn1 = game.playerTurn();
        expect(playerTurn1).equal(game.player1);
        game.changeTurnTwoPlayers();
        const playerTurn2 = game.playerTurn();
        expect(playerTurn2).equal(game.player2);
    });

    it('method playerTurnValid should return true if its the turn of the player enter in parameter', () => {
        const playerTurnValid = game.playerTurnValid('player1');
        expect(playerTurnValid).equal(true);
    });

    it('method playerTurnValid should return false if its not the turn of the player enter in parameter', () => {
        const playerTurnValid = game.playerTurnValid('player2');
        expect(playerTurnValid).equal(false);
    });

    it('method playerTurnValid should call playerTurn', () => {
        const spy = sinon.spy(game, 'playerTurn');
        game.playerTurnValid('player2');
        assert(spy.called);
    });

    it('method getRandomLetterReserve should return a random letter of the reserve', () => {
        const letter = game.getRandomLetterReserve();
        const letterValidationVerification = /^([A-Z]|[*])$/;
        expect(letterValidationVerification.test(letter)).equal(true);
    });

    it('method getRandomLetterReserve should maintain the reserve up to date', () => {
        const reserveInitialLength = game.reserveLetters.length;
        game.getRandomLetterReserve();
        const reserveFinalLength = game.reserveLetters.length;
        expect(reserveInitialLength - 1).equal(reserveFinalLength);
    });

    it('method getRandomLetterReserve should return an empty string if the reserve is empty', () => {
        game.reserveLetters = [];
        const letter = game.getRandomLetterReserve();
        expect(letter).equal('');
    });

    it('method tileHolderContains should return true if the letters are include in the tileHolder of the player whose turn it is', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.tileHolderContains('aca');
        expect(result).equal(true);
    });

    it('method tileHolderContains should return true if a capital letter is enter as a parameter and a * is include in the tileHolder', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.tileHolderContains('A');
        expect(result).equal(true);
    });

    it('method tileHolderContains should return false if the letters are not include in the tileHolder of the player whose turn it is', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.tileHolderContains('awz');
        expect(result).equal(false);
    });
});
