import { WORD_LETTER_2X_MULTIPLIER, WORD_LETTER_3X_MULTIPLIER, WORD_LETTER_NO_MULTIPLIER } from '@common/constants/general-constants';
import { Orientation } from '@common/orientation';
import { Tile } from '@common/tile/Tile';
import { PlacementInformations } from 'assets/placement-informations';
import { expect } from 'chai';
import { Game } from './../game/game';
import { PointsCalculator } from './points-calculator';

describe('Points Calculator', () => {
    let game: Game;
    let wordMultiplier: number;
    let placementInformations: PlacementInformations;
    const letterTile: Tile[] = [];
    beforeEach(() => {
        game = new Game();
        wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
        placementInformations = {
            row: 7,
            column: 7,
            orientation: Orientation.h,
            letters: ['a', 'l', 'l', 'o'],
            numberLetters: 4,
        };
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 4; i++) {
            letterTile.push(new Tile(WORD_LETTER_NO_MULTIPLIER, placementInformations.column + i, placementInformations.row));
        }
    });

    afterEach(() => {
        wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
    });

    it('method specialPropertyLetter should return WORD_LETTER_NO_MULTIPLIER if Tile does not have special property', () => {
        const column = 7;
        const row = 8;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard.cases[column][row])).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_2X_MULTIPLIER if Tile has double letter', () => {
        const column = 3;
        const row = 0;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard.cases[column][row])).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyLetter should return WORD_LETTER_3X_MULTIPLIER if Tile has triple letter', () => {
        const column = 5;
        const row = 1;
        expect(PointsCalculator.specialPropertyLetter(game.gameBoard.cases[column][row])).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_NO_MULTIPLIER if Tile has no special property', () => {
        const column = 8;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard.cases[column][row], wordMultiplier)).to.equal(WORD_LETTER_NO_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_2X_MULTIPLIER if Tile has doubleWord', () => {
        const column = 7;
        const row = 7;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard.cases[column][row], wordMultiplier)).to.equal(WORD_LETTER_2X_MULTIPLIER);
    });

    it('method specialPropertyWord should return WORD_LETTER_3X_MULTIPLIER if Tile has tripleWord', () => {
        const column = 0;
        const row = 0;
        expect(PointsCalculator.specialPropertyWord(game.gameBoard.cases[column][row], wordMultiplier)).to.equal(WORD_LETTER_3X_MULTIPLIER);
    });

    it('method newLetterOnBoard should return true if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.addLetterTile(letterTile[i].positionX, placementInformations.row, letterTile[i].letter);
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const isNew = PointsCalculator.newLetterOnBoard(letter, letterTile);
        expect(isNew).to.equal(true);
    });

    it('method calculatedPointsPlacement should add 50 points to a 7 letters placement', () => {
        const newLettersString: string[] = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
        const newLettersTile: Tile[] = [];
        const newWords: Tile[][] = [];
        for (let i = 0; i < newLettersString.length; i++) {
            const tile = new Tile(WORD_LETTER_NO_MULTIPLIER, 0, i);
            tile.letter = newLettersString[i];
            tile.value = 0;
            newLettersTile.push(tile);
        }
        const result = PointsCalculator.calculatedPointsPlacement(newWords, newLettersTile);
        expect(result).to.equal(50);
    });

    it('method newLetterOnBoard should return false if the letter was just placed', () => {
        for (let i = 0; i < placementInformations.letters.length; i++) {
            game.gameBoard.addLetterTile(letterTile[i].positionX, placementInformations.row, letterTile[i].letter);
        }
        const letter = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const wrongLetters = [];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 4; i++) {
            wrongLetters.push(new Tile(i, placementInformations.row, WORD_LETTER_NO_MULTIPLIER));
        }
        const isNew = PointsCalculator.newLetterOnBoard(letter, wrongLetters);
        expect(isNew).to.equal(false);
    });
});
