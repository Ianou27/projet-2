import { caseProperty } from '@app/../assets/caseProperty';
import { GameBoardService } from '@app/services/game-board/game-board.service';

describe('GameBoard', () => {
    let gameBoard: GameBoardService;

    beforeEach(() => {
        gameBoard = new GameBoardService();
    });
    it('constructor should construct a gameBoard of 15x15 tiles ', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            result += colonne.length;
        }
        expect(result).toEqual(225);
    });

    it('constructor should construct a gameBoard of 15x15 tiles ', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            result += colonne.length;
        }
        expect(result).toEqual(225);
        expect(gameBoard.cases.length).toEqual(15);
    });

    it('gameBoard should contains 8 tiles with the property wordTriple', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.getSpecialProperty() == caseProperty.wordTriple) {
                    result += 1;
                }
            }
        }
        expect(result).toEqual(8);
    });

    it('gameBoard should contains 17 tiles with the property wordDouble', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.getSpecialProperty() == caseProperty.wordDouble) {
                    result += 1;
                }
            }
        }
        expect(result).toEqual(17);
    });

    it('gameBoard should contains 12 tiles with the property letterTriple', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.getSpecialProperty() == caseProperty.letterTriple) {
                    result += 1;
                }
            }
        }
        expect(result).toEqual(12);
    });

    it('gameBoard should contains 24 tiles with the property letterDouble', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.getSpecialProperty() == caseProperty.letterDouble) {
                    result += 1;
                }
            }
        }
        expect(result).toEqual(24);
    });

    it('tileContainsLetter should return false if the tile doesnt contain a letter', () => {
        const position = [0, 0];
        const result = gameBoard.tileContainsLetter(position);
        expect(result).toEqual(false);
    });

    it('tileContainsLetter should return true if the tile contains a letter', () => {
        const position = [0, 0];
        const letter = 'a';
        gameBoard.addLetterTile(position, letter);
        const result = gameBoard.tileContainsLetter(position);
        expect(result).toEqual(true);
    });
});
