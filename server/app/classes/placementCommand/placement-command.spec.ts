import { CaseProperty } from '@common/assets/case-property';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';
import { Player } from './../player/player';

describe('Placement Command', () => {
    let game: Game;
    const lettersTilePlayer1: Tile[] = [];
    const hisTurn = true;
    const letters = ['A', 'L', 'L', '*', 'E', 'E', 'V'];
    for (const letter of letters) {
        const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
        tile1.addLetter(letter);
        lettersTilePlayer1.push(tile1);
    }

    beforeEach(() => {
        game = new Game();
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
    });

    it('method validatedPlaceCommandFormat should return false if its not compose of 3 terms', () => {
        const commandNotValid = '!placer H8v alle 123';
        const validation = PlacementCommand.validatedPlaceCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equals(false);
    });

    it('method validatedPlaceCommandFormat should return true if it correspond to the format of a one letter placement', () => {
        const commandOneLetterValidWithOrientation = '!placer H8v v';
        const commandOneLetterValidWithoutOrientation = '!placer H8 v';
        const validationWithOrientation = PlacementCommand.validatedPlaceCommandFormat(commandOneLetterValidWithOrientation.split(' '));
        const validationWithoutOrientation = PlacementCommand.validatedPlaceCommandFormat(commandOneLetterValidWithoutOrientation.split(' '));
        expect(validationWithOrientation).to.equals(true);
        expect(validationWithoutOrientation).to.equals(true);
    });

    it('method validatedPlaceCommandFormat should return true if it correspond to the format of a multiple letters placement', () => {
        const firstWordCommandValid = '!placer H8v alle';
        const validation = PlacementCommand.validatedPlaceCommandFormat(firstWordCommandValid.split(' '));
        expect(validation).to.equals(true);
    });

    it('method validatedPlaceCommandBoard should return false if the first horizontal placement doesnt touch the center', () => {
        const firstWordCommandNotValid = '!placer H2h va';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return false if the first vertical placement doesnt touch the center', () => {
        const firstWordCommandNotValid = '!placer H2v va';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return true if the first horizontal placement touch the center', () => {
        const firstWordCommandNotValid = '!placer H8h va';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method validatedPlaceCommandBoard should return true if the first vertical placement touch the center', () => {
        const firstWordCommandNotValid = '!placer H8v va';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method validatedPlaceCommandBoard should return false if a horizontal placement is outside the board', () => {
        const firstWordCommandNotValid = '!placer O14h alle';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return false if a vertical placement is outside the board', () => {
        const firstWordCommandNotValid = '!placer O14v alle';
        const result = PlacementCommand.validatedPlaceCommandBoard(firstWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return false if the second placement horizontal doesnt touch a word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer A3h va';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.validatedPlaceCommandBoard(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return false if the second placement vertical doesnt touch a word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer A3v va';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.validatedPlaceCommandBoard(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(false);
    });

    it('method validatedPlaceCommandBoard should return true if the next horizontal placement touch another word', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommandNotValid = '!placer H7h ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.validatedPlaceCommandBoard(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method validatedPlaceCommandBoard should return true if the next vertical placement touch another word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer G8v ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.validatedPlaceCommandBoard(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method placeWord should be able to let the player place a word around another word vertical', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer G8v ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.placeWord(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method placeWord should be able to let the player place a word around another word horizontal', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommandNotValid = '!placer G8h ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        game.player1 = new Player(lettersTilePlayer1, hisTurn, 'player1');
        const result = PlacementCommand.placeWord(secondWordCommandNotValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method placeWord should not place a word if it not respect the orientation h or v', () => {
        const firstWordCommand = '!placer H8a alle';
        const result = PlacementCommand.placeWord(firstWordCommand.split(' '), game);

        expect(result).to.equal(false);
    });
});
