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
        /* placementInformations.column = 7;
        placementInformations.row = 7;
        placementInformations.orientation = 'h';
        placementInformations.letters = ['a', 'l', 'l', 'o'];
        placementInformations.numberLetters = 4;*/
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        letterPositions = [7, 8, 9, 10];
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].letter = placementInformations.letters[i];
            game.gameBoard.cases[letterPositions[i]][placementInformations.row].value = letterValue[placementInformations.letters[i]];
        }
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
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const isNew = PointsCalculator.newLetterOnBoard(letter, letterPositions, placementInformations);
        expect(isNew).to.equal(true);
    });
});
