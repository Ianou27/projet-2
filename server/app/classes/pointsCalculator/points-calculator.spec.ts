import { PlacementInformations } from '@app/placement-informations';
import { letterValue } from '@common/assets/reserve-letters';
import { WORD_LETTER_2X_MULTIPLIER, WORD_LETTER_3X_MULTIPLIER, WORD_LETTER_NO_MULTIPLIER } from '@common/constants/general-constants';
import { expect } from 'chai';
import { Game } from './../game/game';
import { PointsCalculator } from './points-calculator';

describe('Points Calculator', () => {
    let game: Game;
    let wordMultiplier: number;
    let placementInformations: PlacementInformations;
    let letterPositions: number[];
    beforeEach(() => {
        game = new Game();
        wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
        placementInformations = {
            row: 7,
            column: 7,
            orientation: 'h',
            letters: ['a', 'l', 'l', 'o'],
            numberLetters: 4,
        };
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        letterPositions = [7, 8, 9, 10];
    });

    afterEach(() => {
        wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
    });

    it('method specialPropertyLetter should return WORD_LETTER_NO_MULTIPLIER if Tile does not have special property', () => {
        const column = 7;
        const row = 8;
        expect(PointsCalculator.specialPropertyLetter(column, row, game)).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_2X_MULTIPLIER if Tile has double letter', () => {
        const column = 3;
        const row = 0;
        expect(PointsCalculator.specialPropertyLetter(column, row, game)).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_3X_MULTIPLIER if Tile has triple letter', () => {
        const column = 5;
        const row = 1;
        expect(PointsCalculator.specialPropertyLetter(column, row, game)).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_NO_MULTIPLIER if Tile has no special property', () => {
        const column = 8;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(column, row, game, wordMultiplier)).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_2X_MULTIPLIER if Tile has doubleWord', () => {
        const column = 7;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(column, row, game, wordMultiplier)).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_3X_MULTIPLIER if Tile has tripleWord', () => {
        const column = 0;
        const row = 0;
        expect(PointsCalculator.specialPropertyWord(column, row, game, wordMultiplier)).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method newLetterOnBoard should return true if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].letter = placementInformations.letters[i];
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].value = letterValue[placementInformations.letters[i]];
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const isNew = PointsCalculator.newLetterOnBoard(letter, letterPositions, placementInformations);
        expect(isNew).to.equal(true);
    });

    it('method newLetterOnBoard should return false if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].letter = placementInformations.letters[i];
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].value = letterValue[placementInformations.letters[i]];
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const wrongLetterPositions = [1, 2, 3, 4];
        const isNew = PointsCalculator.newLetterOnBoard(letter, wrongLetterPositions, placementInformations);
        expect(isNew).to.equal(false);
    });
});

/* describe('Points', () => {
    let placement: PlacementInformations;
    let game: Game;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    let newLetterPositions: number[];

    beforeEach(() => {
        game = new Game();
        placement = {
            row: 7,
            column: 7,
            orientation: 'h',
            letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A'],
            numberLetters: 7,
        };
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        newLetterPositions = [7, 8, 9, 10, 11, 12, 13];
        for (let i = 0; i < placement.letters.length; i++) {
            game.gameBoard.cases[newLetterPositions[i]][placement.row].letter = placement.letters[i];
            game.gameBoard.cases[newLetterPositions[i]][placement.row].value = letterValue[placement.letters[i]];
        }
    });

    it('method calculatedPointsPlacement should return the right number of points', () => {
        const wordsFormed: Tile[][] = [];
        const word = [];
        for (let i = 0; i < placement.letters.length; i++) {
            word.push(game.gameBoard.cases[newLetterPositions[i]][placement.row]);
        }
        wordsFormed.push(word);
        const point = PointsCalculator.calculatedPointsPlacement(wordsFormed, newLetterPositions, placement, game);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(point).to.equal(66);
    });
}); */
