/* eslint-disable max-lines */
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';
import { Player } from './../player/player';
import { PointsCalculator } from './../pointsCalculator/points-calculator';

describe('Placement Command', () => {
    let game: Game;
    let lettersTilePlayer1: Tile[] = [];
    let lettersTilePlayer2: Tile[] = [];
    const lettersPlayer1 = ['A', 'L', 'L', '*', 'E', 'E', 'V'];
    const lettersPlayer2 = ['B', 'A', 'T', '*', 'E', 'V', 'A'];

    beforeEach(() => {
        game = new Game();
        game.player1Join({ username: 'rt1', id: '1', room: 'room1' }, '60');
        // game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'rt1', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player2', { username: 'rta', id: '2', room: 'room1' });
        for (const letter of lettersPlayer1) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letter;
            tile1.value = letterValue[letter];
            lettersTilePlayer1.push(tile1);
        }
        for (const letter of lettersPlayer2) {
            const tile2: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile2.letter = letter;
            tile2.value = letterValue[letter];
            lettersTilePlayer2.push(tile2);
        }
        game.player1.letters = lettersTilePlayer1;
        game.player2.letters = lettersTilePlayer2;
    });

    afterEach(() => {
        lettersTilePlayer1 = [];
        lettersTilePlayer2 = [];
    });

    it('method validatedPlaceCommandFormat should return false if it compose of 3 terms', () => {
        const commandNotValid = '!placer H8v alle 123';
        const validation = PlacementCommand.validatedPlaceCommandFormat(commandNotValid.split(' '));
        expect(validation).to.equals(false);
    });

    it('method validatedPlaceCommandFormat should return true if it correspond to one of the formats of a one letter placement', () => {
        const commandOneLetterValidWithOrientation = '!placer H8v v';
        const commandOneLetterValidWithoutOrientation = '!placer H8 v';
        const validationWithOrientation = PlacementCommand.validatedPlaceCommandFormat(commandOneLetterValidWithOrientation.split(' '));
        const validationWithoutOrientation = PlacementCommand.validatedPlaceCommandFormat(commandOneLetterValidWithoutOrientation.split(' '));
        expect(validationWithOrientation).to.equals(true);
        expect(validationWithoutOrientation).to.equals(true);
    });

    it('method validatedPlaceCommandFormat should return true if it correspond to the format of a multiple letters placement', () => {
        const commandLettersValidWithOneNumberColumn = '!placer H8v alle';
        const commandLettersValidWithTwoNumbersColumn = '!placer H13v alle';
        const validationOneNumberColumn = PlacementCommand.validatedPlaceCommandFormat(commandLettersValidWithOneNumberColumn.split(' '));
        const validationTwoNumberColumn = PlacementCommand.validatedPlaceCommandFormat(commandLettersValidWithTwoNumbersColumn.split(' '));
        expect(validationOneNumberColumn).to.equals(true);
        expect(validationTwoNumberColumn).to.equals(true);
    });

    it('method firstWordTouchCenter should return false if the first placement which is horizontal doesnt touch the center', () => {
        const firstWordCommandNotValid = '!placer H2h va';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandNotValid.split(' '));
        const result = PlacementCommand.firstWordTouchCenter(placementInformations, game);
        expect(result).to.equal(false);
    });

    it('method firstWordTouchCenter should return false if the first placement which is vertical doesnt touch the center', () => {
        const firstWordCommandNotValid = '!placer H2v va';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandNotValid.split(' '));
        const result = PlacementCommand.firstWordTouchCenter(placementInformations, game);
        expect(result).to.equal(false);
    });

    it('method firstWordTouchCenter should return true if the first placement which is horizontal touch the center', () => {
        const firstWordCommandValid = '!placer H8h va';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandValid.split(' '));
        const result = PlacementCommand.firstWordTouchCenter(placementInformations, game);
        expect(result).to.equal(true);
    });

    it('method firstWordTouchCenter should return true if the first placement which is vertical touch the center', () => {
        const firstWordCommandValid = '!placer H8v va';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandValid.split(' '));
        const result = PlacementCommand.firstWordTouchCenter(placementInformations, game);
        expect(result).to.equal(true);
    });

    it('method firstWordTouchCenter should return false if the first placement which is vertical doesnt touch the center and out of bounce', () => {
        const firstWordCommandNotValid = '!placer H14v valle';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandNotValid.split(' '));
        const result = PlacementCommand.firstWordTouchCenter(placementInformations, game);
        expect(result).to.equal(false);
    });

    it('method insideBoardGame should return false if a horizontal placement is outside the board', () => {
        const firstWordCommandNotValid = '!placer O14h alle';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandNotValid.split(' '));
        const result = PlacementCommand.insideBoardGame(placementInformations, game);
        expect(result).to.equal(false);
    });

    it('method insideBoardGame should return false if a vertical placement is outside the board', () => {
        const firstWordCommandNotValid = '!placer O14v alle';
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(firstWordCommandNotValid.split(' '));
        const result = PlacementCommand.insideBoardGame(placementInformations, game);
        expect(result).to.equal(false);
    });

    it('method wordHasAdjacent should return false if the second placement which is horizontal doesnt touch a word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer A3h bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandNotValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(false);
    });

    it('method wordHasAdjacent should return false if the second placement which is vertical doesnt touch a word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandNotValid = '!placer A3v bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandNotValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(false);
    });

    it('method wordHasAdjacent should return true if the next horizontal placement touch another word on top', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommandValid = '!placer H7h bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(true);
    });

    it('method wordHasAdjacent should return true if the next horizontal placement touch another word on bottom', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommandValid = '!placer I8h bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(true);
    });

    it('method wordHasAdjacent should return true if the next vertical placement touch another word on left', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandValid = '!placer H7v bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(true);
    });

    it('method wordHasAdjacent should return true if the next vertical placement touch another word on right', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandValid = '!placer H9v bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(true);
    });

    it('method wordHasAdjacent should return true if the next vertical placement touch another word', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandValid = '!placer G8v bat';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const placementInformationsSecondPlacement = PlacementCommand.separatePlaceCommandInformations(secondWordCommandValid.split(' '));
        const result = PlacementCommand.wordHasAdjacent(placementInformationsSecondPlacement, game);
        expect(result).to.equal(true);
    });

    it('method placeWord should be able to let the player place a word around another word vertical', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandValid = '!placer G8v ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const result = PlacementCommand.placeWord(secondWordCommandValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method placeWord should be able to let the player place a word around another word horizontal', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommandValid = '!placer H7h ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const result = PlacementCommand.placeWord(secondWordCommandValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method validatedPlaceCommandBoard should not be able to let the player place a one letter word if its the first turn', () => {
        const firstWordCommand = '!placer H8h l';
        const commandInformations = firstWordCommand.split(' ');
        const result = PlacementCommand.validatedPlaceCommandBoard(commandInformations, game);
        expect(result).equal(false);
    });

    it('method validatedPlaceCommandBoard should be able to let the player place a one letter word if its not the first turn', () => {
        const firstWordCommand = '!placer H8v alle';
        const secondWordCommandValid = '!placer G8v ve';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const result = PlacementCommand.validatedPlaceCommandBoard(secondWordCommandValid.split(' '), game);
        expect(result).to.equal(true);
    });

    it('method placeWord should be able to let the player place a one letter word if its not the first turn for a one digit column', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommand = '!placer G8 t';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const result = PlacementCommand.placeWord(secondWordCommand.split(' '), game);
        expect(result).equal(true);
    });

    it('method placeWord should be able to let the player place a one letter word if its not the first turn for a two digit column', () => {
        const firstWordCommand = '!placer H8h alle';
        const secondWordCommand = '!placer G11 t';
        PlacementCommand.placeWord(firstWordCommand.split(' '), game);
        const result = PlacementCommand.placeWord(secondWordCommand.split(' '), game);
        expect(result).equal(true);
    });

    it('method placeWord should call changeTurnTwoPlayers of object game', () => {
        const spy = sinon.spy(game, 'changeTurnTwoPlayers');
        const firstWordCommand = '!placer H8h alle';
        const commandInformations = firstWordCommand.split(' ');
        PlacementCommand.placeWord(commandInformations, game);
        assert(spy.calledOnce);
    });

    it('method placeWord should call changeLetter to give letters back to the player', () => {
        const spy = sinon.stub(game.player1, 'changeLetter');
        const firstWordCommand = '!placer H8h alle';
        const commandInformations = firstWordCommand.split(' ');
        PlacementCommand.placeWord(commandInformations, game);
        assert(spy.call);
    });

    it('method placeWord should call verifyGameState to verify if the game has ended', () => {
        const spy = sinon.stub(game, 'verifyGameState');
        const firstWordCommand = '!placer H8h alle';
        const commandInformations = firstWordCommand.split(' ');
        PlacementCommand.placeWord(commandInformations, game);
        assert(spy.call);
    });

    it('method placeWord should return false if the letters doesnt form a word from the dictionary for a horizontal placement', () => {
        const firstWordCommand = '!placer H8h lalv';
        const commandInformations = firstWordCommand.split(' ');
        const result = PlacementCommand.placeWord(commandInformations, game);
        expect(result).equal(false);
    });

    it('method placeWord should return false if the letters doesnt form a word from the dictionary for a vertical placement', () => {
        const firstWordCommand = '!placer H8v lalv';
        const commandInformations = firstWordCommand.split(' ');
        const result = PlacementCommand.placeWord(commandInformations, game);
        expect(result).equal(false);
    });

    it('method placeWord should call calculatedPointsPlacement from pointCalculator if the words are valid', () => {
        const spy = sinon.stub(PointsCalculator, 'calculatedPointsPlacement').callsFake(() => 0);
        const firstWordCommand = '!placer H8v alle';
        const commandInformations = firstWordCommand.split(' ');
        PlacementCommand.placeWord(commandInformations, game);
        assert(spy.called);
    });

    it('method validatedWordDictionary should return True when a word is in the dictionary', () => {
        const word = 'ourson';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(true);
    });

    it('method validatedWordDictionary should return False when a word is not in the dictionary', () => {
        const word = 'aaaaaaa';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(false);
    });

    it('method validatedWordDictionary should return False when a word is smaller than 2 letters', () => {
        const word = 'a';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(false);
    });

    it('method validatedWordDictionary should return False if a word contains an apostrophe', () => {
        const word = "aujourd'hui";
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(false);
    });

    it('method validatedWordDictionary should return False if a word contains an hyphen', () => {
        const word = 'arc-en-ciel';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(false);
    });

    it('method validatedWordDictionary should return true if the word is in the dictionary even if it contains an accent', () => {
        const word = 'éléphant';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(true);
    });

    it('method validatedWordDictionary should return true if the word is in the dictionary even if it contains an cedilla', () => {
        const word = 'garçon';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(true);
    });

    it('method validatedWordDictionary should return true if the word is in the dictionary even if it contains an diaeresis', () => {
        const word = 'noël';
        const result = PlacementCommand.validatedWordDictionary(word);
        expect(result).to.equals(true);
    });
});
