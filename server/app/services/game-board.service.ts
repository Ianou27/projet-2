import { CaseProperty } from './../../../common/assets/case-property';
import { letterValue } from './../../../common/assets/reserve-letters';
import { COLUMN_ROWS_NUMBER } from './../../../common/constants/general-constants';
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
