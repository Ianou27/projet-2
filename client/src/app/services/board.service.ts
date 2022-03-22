import { Injectable } from '@angular/core';
import { Tile } from '@app/../../../common/tile/Tile';
import { CaseProperty } from './../../../../common/assets/case-property';
import { COLUMN_ROWS_NUMBER } from './../../../../common/constants/general-constants';
import { LETTER_2X, LETTER_3X, WORD_2X, WORD_3X } from './../../../../common/constants/tile-information';
import { Vec2 } from './../../../../common/vec2';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Tile[][];

    build() {
        this.board = new Array(COLUMN_ROWS_NUMBER);
        for (let i = 0; i < COLUMN_ROWS_NUMBER; i++) {
            this.board[i] = new Array(COLUMN_ROWS_NUMBER);
            for (let j = 0; j < COLUMN_ROWS_NUMBER; j++) {
                if (this.hasTheProperty(WORD_3X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.WordTriple, i, j);
                } else if (this.hasTheProperty(WORD_2X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.WordDouble, i, j);
                } else if (this.hasTheProperty(LETTER_3X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.LetterTriple, i, j);
                } else if (this.hasTheProperty(LETTER_2X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.LetterDouble, i, j);
                } else {
                    this.board[i][j] = new Tile(CaseProperty.Normal, i, j);
                }
            }
        }
    }

    setLetter(posX: number, posY: number, letter: string, value: number) {
        this.board[posX][posY].letter = letter.toUpperCase();
        this.board[posX][posY].value = value;
    }

    removeLetter(posX: number, posY: number) {
        this.board[posX][posY].letter = '';
        this.board[posX][posY].value = 0;
    }

    private hasTheProperty(property: Vec2[], positionX: number, positionY: number): boolean {
        for (const position of property) {
            if (position.x === positionX && position.y === positionY) {
                return true;
            }
        }
        return false;
    }
}
