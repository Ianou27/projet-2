import { CaseProperty } from './../../../common/assets/case-property';
import { letterValue } from './../../../common/assets/reserve-letters';
import { COLUMN_ROWS_MINIMUM, COLUMN_ROWS_NUMBER, MAXIMUM_ROW_COLUMN } from './../../../common/constants/general-constants';
import { LETTER_2X, LETTER_3X, WORD_2X, WORD_3X } from './../../../common/constants/tile-information';
import { Tile } from './../../../common/tile/Tile';
import { Vec2 } from './../../../common/vec2';

export class GameBoardService {
    cases: Tile[][] = new Array(COLUMN_ROWS_NUMBER);
    constructor() {
        for (let i = 0; i < COLUMN_ROWS_NUMBER; i++) {
            this.cases[i] = new Array(COLUMN_ROWS_NUMBER);
            for (let j = 0; j < COLUMN_ROWS_NUMBER; j++) {
                if (this.verifyProperty(WORD_3X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.WordTriple, i, j);
                } else if (this.verifyProperty(WORD_2X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.WordDouble, i, j);
                } else if (this.verifyProperty(LETTER_3X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.LetterTriple, i, j);
                } else if (this.verifyProperty(LETTER_2X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.LetterDouble, i, j);
                } else {
                    this.cases[i][j] = new Tile(CaseProperty.Normal, i, j);
                }
            }
        }
    }

    tileContainsLetter(positionX: number, positionY: number): boolean {
        return this.cases[positionX][positionY].letter !== '';
    }

    addLetterTile(positionX: number, positionY: number, letter: string): void {
        if (this.isUpperCase(letter)) {
            this.cases[positionX][positionY].value = 0;
        } else {
            letter = letter.toUpperCase();
            this.cases[positionX][positionY].value = letterValue[letter];
        }
        this.cases[positionX][positionY].letter = letter;
    }

    nextTile(currentTile: Tile, orientation: string, revert: boolean): Tile {
        let nextTile: Tile;
        if (orientation === 'h') {
            if (revert) {
                nextTile = this.cases[currentTile.positionX - 1][currentTile.positionY];
            } else {
                nextTile = this.cases[currentTile.positionX + 1][currentTile.positionY];
            }
        } else {
            if (revert) {
                nextTile = this.cases[currentTile.positionX][currentTile.positionY - 1];
            } else {
                nextTile = this.cases[currentTile.positionX][currentTile.positionY + 1];
            }
        }
        return nextTile;
    }

    isTopOrRight(currentTile: Tile, orientation: string): boolean {
        if (orientation === 'h') {
            if (currentTile.positionX === COLUMN_ROWS_MINIMUM) return true;
        } else if (currentTile.positionY === COLUMN_ROWS_MINIMUM) {
            return true;
        }
        return false;
    }

    isBottomOrLeft(currentTile: Tile, orientation: string): boolean {
        if (orientation === 'h') {
            if (currentTile.positionX === MAXIMUM_ROW_COLUMN) return true;
        } else if (currentTile.positionY === MAXIMUM_ROW_COLUMN) {
            return true;
        }
        return false;
    }

    private verifyProperty(property: Vec2[], positionX: number, positionY: number): boolean {
        for (const position of property) {
            if (position.x === positionX && position.y === positionY) {
                return true;
            }
        }
        return false;
    }

    private isUpperCase(letter: string): boolean {
        return letter === letter.toUpperCase();
    }
}
