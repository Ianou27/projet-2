import { Injectable } from '@angular/core';
import { CaseProperty } from 'src/assets/case-property';
import { Tile } from './../../classes/tile/tile';
import { Vec2 } from './../../classes/vec2';
import { COLUMN_ROWS_NUMBER } from './../../constants/general-constants';
import { LETTER_2X, LETTER_3X, WORD_2X, WORD_3X } from './../../constants/tile-information';

/* declare var require: any;
const fs = require('fs'); */
@Injectable({
    providedIn: 'root',
})
export class GameBoardService {
    cases: Tile[][] = new Array(COLUMN_ROWS_NUMBER);
    constructor() {
        for (let i = 0; i < COLUMN_ROWS_NUMBER; i++) {
            this.cases[i] = new Array(COLUMN_ROWS_NUMBER);
            for (let j = 0; j < COLUMN_ROWS_NUMBER; j++) {
                if (this.verifyProperty(WORD_3X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.WordTriple);
                } else if (this.verifyProperty(WORD_2X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.WordDouble);
                } else if (this.verifyProperty(LETTER_3X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.LetterTriple);
                } else if (this.verifyProperty(LETTER_2X, i, j)) {
                    this.cases[i][j] = new Tile(CaseProperty.LetterDouble);
                } else {
                    this.cases[i][j] = new Tile(CaseProperty.Normal);
                }
            }
        }
    }

    tileContainsLetter(positionX: number, positionY: number): boolean {
        return this.cases[positionX][positionY].tileContainsLetter();
    }

    addLetterTile(positionX: number, positionY: number, letter: string): void {
        this.cases[positionX][positionY].addLetter(letter);
    }

    private verifyProperty(property: Vec2[], positionX: number, positionY: number): boolean {
        for (const position of property) {
            if (position.x === positionX && position.y === positionY) {
                return true;
            }
        }
        return false;
    }
}
