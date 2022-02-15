import { ExchangeCommand } from '@app/classes/exchangeCommand/exchange-command';
import { PassCommand } from '@app/classes/passCommand/pass-command';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './../classes/game/game';
import { PlacementCommand } from './../classes/placementCommand/placement-command';
import { GameManager } from './gameManager.service';

describe('Game Manager', () => {
    let game: Game;
    let gameManager: GameManager;
    const placeCommand = ['!placer', 'H8v', 'allo'];
    const exchangeCommand = ['!exchange', 'allo'];
    const passCommand = ['!pass'];

    beforeEach(() => {
        game = new Game();
        gameManager = new GameManager();
    });

    it('method placeWord should call PlacementCommand.placeWord', () => {
        const spy = sinon.spy(PlacementCommand, 'placeWord');
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
        const spy = sinon.spy(PassCommand, 'passTurn');
        gameManager.pass(game);
        assert(spy.called);
        assert(spy.calledWith(game));
    });

    it('method passCommandValid should call PassCommand.validatedPassCommandFormat', () => {
        const spy = sinon.spy(PassCommand, 'validatedPassCommandFormat');
        gameManager.passCommandValid(passCommand);
        assert(spy.called);
        assert(spy.calledWith(passCommand));
    });

    it('method exchange should call ExchangeCommand.exchangeLetters', () => {
        const spy = sinon.spy(ExchangeCommand, 'exchangeLetters');
        gameManager.exchange(exchangeCommand, game);
        assert(spy.called);
        assert(spy.calledWith(exchangeCommand, game));
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
});
