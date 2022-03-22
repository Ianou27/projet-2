import { Injectable } from '@angular/core';
import { NUMBER_LETTER_TILEHOLDER } from '@app/constants/general-constants';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';

@Injectable({
    providedIn: 'root',
})
export class TileHolderService {
    tileHolder: Tile[];
    removedLetters: string[];
    constructor() {
        this.tileHolder = new Array(NUMBER_LETTER_TILEHOLDER);
        for (let i = 0; i < NUMBER_LETTER_TILEHOLDER; i++) {
            this.tileHolder[i] = new Tile(CaseProperty.Normal, 0, i);
        }
        this.removedLetters = [];
    }

    removeLetter(letter: string) {
        for (let i = 0; i < this.tileHolder.length; i++) {
            if (letter.toUpperCase() === letter) {
                if (this.tileHolder[i].letter === '*') {
                    this.tileHolder.splice(i, 1);
                    this.removedLetters.push('*');
                    break;
                }
            } else if (this.tileHolder[i].letter === letter.toUpperCase()) {
                this.tileHolder.splice(i, 1);
                this.removedLetters.push(letter.toUpperCase());
                break;
            }
        }
    }

    letterInTileHolder(letter: string): [boolean, number] {
        for (let i = 0; i < this.tileHolder.length; i++) {
            if (letter === letter.toUpperCase()) {
                if ('*' === this.tileHolder[i].letter) return [true, i];
            }
            if (letter.toUpperCase() === this.tileHolder[i].letter) return [true, i];
        }
        return [false, 0];
    }

    addLetter(letter: string) {
        for (let i = 0; i < this.removedLetters.length; i++) {
            if (this.removedLetters[i] === letter.toUpperCase()) {
                const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
                tile.letter = letter.toUpperCase();
                tile.value = letterValue[letter.toUpperCase()];
                this.tileHolder.push(tile);
                this.removedLetters.splice(i, 1);
                break;
            }
        }
    }
}
