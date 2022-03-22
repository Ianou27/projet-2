import { ExchangeCommand } from '@app/classes/exchangeCommand/exchange-command';
import { PassCommand } from '@app/classes/passCommand/pass-command';
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './../classes/game/game';
import { PlacementCommand } from './../classes/placementCommand/placement-command';
import { Player } from './../classes/player/player';
import { DatabaseService } from './best-score.services';
import { GameManager } from './game-manager.service';

describe('Game Manager', () => {
    let game: Game;
    let gameManager: GameManager;
    const placeCommand = ['!placer', 'H8v', 'all'];
    const exchangeCommand = ['!echanger', 'all'];
    const passCommand = ['!passer'];
    let lettersTilePlayer1: Tile[] = [];
    const databaseService: DatabaseService = new DatabaseService();
    beforeEach(() => {
        game = new Game();
        game.player1Join({ username: 'a', id: '1', room: 'room1' }, '60', databaseService);
        // game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'a', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player2', { username: 'b', id: '2', room: 'room1' });
        const lettersPlayer1 = ['A', 'L', 'L', '', 'E', 'E', 'V'];
        for (const letter of lettersPlayer1) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letter;
            tile1.value = letterValue[letter];
            lettersTilePlayer1.push(tile1);
        }
        game.player1.letters = lettersTilePlayer1;
        gameManager = new GameManager();
    });

    afterEach(() => {
        lettersTilePlayer1 = [];
        sinon.restore();
    });

    it('method placeWord should call PlacementCommand.placeWord', () => {
        const spy = sinon.stub(PlacementCommand, 'placeWord');
        gameManager.placeWord(placeCommand, game);
        assert(spy.called);
        assert(spy.calledWith(placeCommand, game));
    });

    it('method placeFormatValid should call PlacementCommand.validatedPlaceCommandFormat', () => {
        const spy = sinon.spy(PlacementCommand, 'validatedPlaceCommandFormat');
        gameManager.placeFormatValid(placeCommand);
        assert(spy.called);
        assert(spy.calledWith(placeCommand));
    });

    it('method placeBoardValid should call PlacementCommand.validatedPlaceComandBoard', () => {
        const spy = sinon.spy(PlacementCommand, 'validatedPlaceCommandBoard');
        gameManager.placeBoardValid(placeCommand, game);
        assert(spy.called);
        assert(spy.calledWith(placeCommand, game));
    });

    it('method pass should call PassCommand.passTurn', () => {
        const spy = sinon.spy(game, 'passTurn');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const fake = sinon.fake(() => {});
        sinon.replace(game.timer, 'reset', fake);
        gameManager.pass(game);
        assert(fake.called);
        assert(spy.called);
    });

    it('method passCommandValid should call PassCommand.validatedPassCommandFormat', () => {
        const spy = sinon.spy(PassCommand, 'validatedPassCommandFormat');
        gameManager.passCommandValid(passCommand);
        assert(spy.called);
        assert(spy.calledWith(passCommand));
    });

    it('method exchange should call ExchangeCommand.exchangeLetters', () => {
        const spy = sinon.spy(game, 'exchangeLetters');
        gameManager.exchange(exchangeCommand, game);
        assert(spy.called);
    });

    it('method exchangeFormatValid should call ExchangeCommand.validatedExchangeCommandFormat', () => {
        const spy = sinon.spy(ExchangeCommand, 'validatedExchangeCommandFormat');
        gameManager.exchangeFormatValid(exchangeCommand);
        assert(spy.called);
        assert(spy.calledWith(exchangeCommand));
    });

    it('method exchangeTileHolderValid should call ExchangeCommand.validatedExchangeCommandBoard', () => {
        const spy = sinon.spy(ExchangeCommand, 'validatedExchangeCommandBoard');
        gameManager.exchangeTileHolderValid(exchangeCommand, game);
        assert(spy.called);
        assert(spy.calledWith(exchangeCommand, game));
    });

    it('method lengthVerification should return false if message has more than 512 characters', () => {
        let testMessageLong = 'ABCDEFGHIJKLMNOP';
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 47; i++) {
            testMessageLong += 'ABCDEFGHIJKLMNOP';
        }
        expect(gameManager.lengthVerification(testMessageLong)).to.equal(false);
    });

    it('method lengthVerification should return true if message has less than 512 characters', () => {
        const message = 'abcdefghijkl';
        expect(gameManager.lengthVerification(message)).to.equal(true);
    });

    it('method characterVerification should return false if message has only spaces', () => {
        const message = '       ';
        expect(gameManager.characterVerification(message)).to.equal(false);
    });

    it('method characterVerification should return true if message does not have only spaces', () => {
        const message = 'abcde';
        expect(gameManager.characterVerification(message)).to.equal(true);
    });

    it('method messageVerification should call lengthVerification and return "message trop long" if it has more than 512 characters', () => {
        let testMessageLong = 'ABCDEFGHIJKLMNOP';
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 47; i++) {
            testMessageLong += 'ABCDEFGHIJKLMNOP';
        }
        gameManager.messageVerification(testMessageLong);
        expect(gameManager.messageVerification(testMessageLong)).to.equal('Message trop long');
    });

    it('method messageVerification should call lengthVerification and return "valide" if it has less than 512 characters', () => {
        const message = 'ABCDEFGHIJKLMNOP';
        gameManager.messageVerification(message);
        expect(gameManager.messageVerification(message)).to.equal('valide');
    });

    it('method placeVerification should call placeFormatValid and placeBoardValid if command is valid and return "valide"', () => {
        const spyFormat = sinon.spy(gameManager, 'placeFormatValid');
        const spyBoard = sinon.spy(gameManager, 'placeBoardValid');
        const validation = gameManager.placeVerification(placeCommand, game);
        assert(spyFormat.called);
        assert(spyFormat.calledWith(placeCommand));
        assert(spyBoard.called);
        assert(spyBoard.calledWith(placeCommand, game));
        expect(validation).to.equal('valide');
    });

    it('method placeVerification should return "Entrée invalide" if format is not valid and not call placeBoardValid', () => {
        const spyBoard = sinon.spy(gameManager, 'placeBoardValid');
        const wrongCommand = ['!placer', 'Z0h', 'abz'];
        expect(gameManager.placeVerification(wrongCommand, game)).to.equal('Entrée invalide');
        assert(spyBoard.notCalled);
    });

    it('method placeVerification should return "Commande impossible à réaliser" if placeBoardValid returns false', () => {
        const wrongCommand = ['!placer', 'N14h', 'abcde'];
        const validation = gameManager.placeVerification(wrongCommand, game);
        expect(validation).to.equal('Commande impossible à réaliser');
    });

    it('method exchangeVerification should call exchangeFormatValid and exchangeTileHolderValid if command is valid and return "valide"', () => {
        const spyFormat = sinon.spy(gameManager, 'exchangeFormatValid');
        const spyBoard = sinon.spy(gameManager, 'exchangeTileHolderValid');
        const validation = gameManager.exchangeVerification(exchangeCommand, game);
        assert(spyFormat.called);
        assert(spyFormat.calledWith(exchangeCommand));
        assert(spyBoard.called);
        assert(spyBoard.calledWith(exchangeCommand, game));
        expect(validation).to.equal('valide');
    });

    it('method exchangeVerification should return "Entrée invalide" if format is not valid and not call exchangeTileHolderValid', () => {
        const spyBoard = sinon.spy(gameManager, 'exchangeTileHolderValid');
        const wrongCommand = ['!echanger', 'zkjhhdasddalkda'];
        expect(gameManager.placeVerification(wrongCommand, game)).to.equal('Entrée invalide');
        assert(spyBoard.notCalled);
    });

    it('method exchangeVerification should return "Commande impossible à réaliser" if exchangeTileHolderValid returns false', () => {
        const wrongCommand = ['!echanger', 'ax'];
        const validation = gameManager.exchangeVerification(wrongCommand, game);
        expect(validation).to.equal('Commande impossible à réaliser');
    });

    it('method passVerification should return "valide" and call passCommandValid if command is valid', () => {
        const spy = sinon.spy(gameManager, 'passCommandValid');
        const validation = gameManager.passVerification(passCommand);
        expect(validation).to.equal('valide');
        assert(spy.called);
    });

    it('method passVerification should return "Format non valide" command format is not valid', () => {
        const wrongCommand = ['!passer', 'lol'];
        const validation = gameManager.passVerification(wrongCommand);
        expect(validation).to.equal('Format non valide');
    });
});
