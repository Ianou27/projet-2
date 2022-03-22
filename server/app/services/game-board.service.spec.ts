/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Orientation } from '@common/orientation';
import { expect } from 'chai';
import { CaseProperty } from './../../../common/assets/case-property';
import { Tile } from './../../../common/tile/Tile';
import { GameBoardService } from './game-board.service';

describe('GameBoard', () => {
    let gameBoard: GameBoardService;
    let currentTile: Tile;
    beforeEach(() => {
        gameBoard = new GameBoardService();
        currentTile = gameBoard.cases[1][1];
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

    it('nextTile should return the right tile depending on parameters', () => {
        expect(gameBoard.nextTile(currentTile, Orientation.h, false)).equal(gameBoard.cases[2][1]);
    });

    it('nextTile should return the left tile depending on parameters', () => {
        expect(gameBoard.nextTile(currentTile, Orientation.h, true)).equal(gameBoard.cases[0][1]);
    });

    it('nextTile should return the upper tile depending on parameters', () => {
        expect(gameBoard.nextTile(currentTile, Orientation.v, true)).equal(gameBoard.cases[1][0]);
    });

    it('nextTile should return the tile down depending on parameters', () => {
        expect(gameBoard.nextTile(currentTile, Orientation.v, false)).equal(gameBoard.cases[1][2]);
    });

    it('isLastTile should return true if tile position X or Y equals 0 or 14 depending on orientation', () => {
        const tile = gameBoard.cases[0][1];
        expect(gameBoard.isTopOrRight(tile, Orientation.h)).equal(true);
    });

    it('isLastTile should return false if tile position X or Y equals 0 or 14 depending on orientation', () => {
        expect(gameBoard.isTopOrRight(currentTile, Orientation.h)).equal(false);
    });

    it('isLastTile should return true if tile position X or Y equals 0 or 14 depending on orientation', () => {
        const tile = gameBoard.cases[2][14];
        expect(gameBoard.isBottomOrLeft(tile, Orientation.v)).equal(true);
    });

    it('isLastTile should return false if tile position X or Y equals 0 or 14 depending on orientation', () => {
        expect(gameBoard.isBottomOrLeft(currentTile, Orientation.h)).equal(false);
    });
});
