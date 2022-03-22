import { CaseProperty } from './../../../../common/assets/case-property';
import { letterNumber, letterValue } from './../../../../common/assets/reserve-letters';
import { NUMBER_TILEHOLDER } from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';

export class ReserveLetters {
    letters: string[];

    constructor() {
        this.letters = this.initializeReserveLetters();
    }

    getRandomLetterReserve(): string {
        const reserveLength = this.letters.length;
        if (reserveLength === 0) {
            return '';
        }
        const element = this.letters[Math.floor(Math.random() * this.letters.length)];
        const indexElement = this.letters.indexOf(element);
        this.letters.splice(indexElement, 1);
        return element;
    }

    randomLettersInitialization(): Tile[] {
        const letters: Tile[] = [];
        for (let i = 0; i < NUMBER_TILEHOLDER; i++) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, i);
            tile.letter = this.getRandomLetterReserve();
            tile.value = letterValue[tile.letter];
            letters.push(tile);
        }
        return letters;
    }

    private initializeReserveLetters(): string[] {
        const reserveLettersObject = letterNumber;
        const reserve: string[] = [];
        Object.keys(reserveLettersObject).forEach((key) => {
            for (let i = 0; i < reserveLettersObject[key]; i++) {
                reserve.push(key);
            }
        });
        return reserve;
    }
}
