import { PlacementInformations } from '@app/placement-informations';
import { letterValue } from '@common/assets/reserve-letters';
import { WORD_LETTER_2X_MULTIPLIER, WORD_LETTER_3X_MULTIPLIER, WORD_LETTER_NO_MULTIPLIER } from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { PointsCalculator } from './points-calculator';

describe('Points Calculator', () => {
    let game: Game;
    let wordMultiplier: number;
    let placementInformations: PlacementInformations;
    let letterTile: Tile[];
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
        for (let i = 0; i < 4; i++) {
            letterTile.push(new Tile(placementInformations.column + i, placementInformations.row, WORD_LETTER_NO_MULTIPLIER));
        }
    });

    afterEach(() => {
        wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
    });

    it('method specialPropertyLetter should return WORD_LETTER_NO_MULTIPLIER if Tile does not have special property', () => {
        const column = 7;
        const row = 8;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard[column][row])).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_2X_MULTIPLIER if Tile has double letter', () => {
        const column = 3;
        const row = 0;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard[column][row])).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_3X_MULTIPLIER if Tile has triple letter', () => {
        const column = 5;
        const row = 1;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard[column][row])).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_NO_MULTIPLIER if Tile has no special property', () => {
        const column = 8;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard[column][row], wordMultiplier)).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_2X_MULTIPLIER if Tile has doubleWord', () => {
        const column = 7;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard[column][row], wordMultiplier)).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_3X_MULTIPLIER if Tile has tripleWord', () => {
        const column = 0;
        const row = 0;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard[column][row], wordMultiplier)).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method newLetterOnBoard should return true if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.cases[letterTile[i].positionX][placementInformations.row].letter = placementInformations.letters[i];
            game.gameBoard.cases[letterTile[i].positionX][placementInformations.row].value = letterValue[placementInformations.letters[i]];
            // game.gameBoard.cases[letterPositions[i]][placementInformations.row].letter = placementInformations.letters[i];
            // game.gameBoard.cases[letterPositions[i]][placementInformations.row].value = letterValue[placementInformations.letters[i]];
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const isNew = PointsCalculator.newLetterOnBoard(letter, letterTile);
        expect(isNew).to.equal(true);
    });

    it('method newLetterOnBoard should return false if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.cases[letterTile[i].positionX][placementInformations.row].letter = placementInformations.letters[i];
            game.gameBoard.cases[letterTile[i].positionX][placementInformations.row].value = letterValue[placementInformations.letters[i]];
            // game.gameBoard.cases[letterPositions[i]][placementInformations.row].letter = placementInformations.letters[i];
            // game.gameBoard.cases[letterPositions[i]][placementInformations.row].value = letterValue[placementInformations.letters[i]];
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const wrongLetters = [];
        for (let i = 0; i < 4; i++) {
            wrongLetters.push(new Tile(i, placementInformations.row, WORD_LETTER_NO_MULTIPLIER));
        }
        const isNew = PointsCalculator.newLetterOnBoard(letter, wrongLetters);
        expect(isNew).to.equal(false);
    });
});
