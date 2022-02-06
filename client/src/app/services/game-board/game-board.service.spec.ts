import { GameBoardService } from '@app/services/game-board/game-board.service';
import { CaseProperty } from './../../../assets/case-property';

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
                if (tile.getSpecialProperty() === CaseProperty.WordTriple) {
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
                if (tile.getSpecialProperty() === CaseProperty.WordDouble) {
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
                if (tile.getSpecialProperty() === CaseProperty.LetterTriple) {
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
                if (tile.getSpecialProperty() === CaseProperty.LetterDouble) {
                    result += 1;
                }
            }
        }
        expect(result).toEqual(24);
    });

    it('tileContainsLetter should return false if the tile doesnt contain a letter', () => {
        const positionX = 0;
        const positionY = 0;
        const result = gameBoard.tileContainsLetter(positionX, positionY);
        expect(result).toEqual(false);
    });

    it('tileContainsLetter should return true if the tile contains a letter', () => {
        const positionX = 0;
        const positionY = 0;
        const letter = 'a';
        gameBoard.addLetterTile(positionX, positionY, letter);
        const result = gameBoard.tileContainsLetter(positionX, positionY);
        expect(result).toEqual(true);
    });
});
