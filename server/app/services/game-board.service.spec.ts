/* eslint-disable @typescript-eslint/no-magic-numbers */
import { expect } from 'chai';
import { CaseProperty } from './../../../common/assets/case-property';
import { GameBoardService } from './game-board.service';

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
        expect(result).equal(225);
    });

    it('constructor should construct a gameBoard of 15x15 tiles ', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            result += colonne.length;
        }
        expect(result).equal(225);
        expect(gameBoard.cases.length).equal(15);
    });

    it('gameBoard should contains 8 tiles with the property wordTriple', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.specialProperty === CaseProperty.WordTriple) {
                    result += 1;
                }
            }
        }
        expect(result).equal(8);
    });

    it('gameBoard should contains 17 tiles with the property wordDouble', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.specialProperty === CaseProperty.WordDouble) {
                    result += 1;
                }
            }
        }
        expect(result).equal(17);
    });

    it('gameBoard should contains 12 tiles with the property letterTriple', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.specialProperty === CaseProperty.LetterTriple) {
                    result += 1;
                }
            }
        }
        expect(result).equal(12);
    });

    it('gameBoard should contains 24 tiles with the property letterDouble', () => {
        let result = 0;
        for (const colonne of gameBoard.cases) {
            for (const tile of colonne) {
                if (tile.specialProperty === CaseProperty.LetterDouble) {
                    result += 1;
                }
            }
        }
        expect(result).equal(24);
    });

    it('tileContainsLetter should return false if the tile doesnt contain a letter', () => {
        const positionX = 0;
        const positionY = 0;
        const result = gameBoard.tileContainsLetter(positionX, positionY);
        expect(result).equal(false);
    });

    it('tileContainsLetter should return true if the tile contains a letter', () => {
        const positionX = 0;
        const positionY = 0;
        const letter = 'a';
        gameBoard.addLetterTile(positionX, positionY, letter);
        const result = gameBoard.tileContainsLetter(positionX, positionY);
        expect(result).equal(true);
    });
});
