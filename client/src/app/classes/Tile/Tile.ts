import { CaseProperty } from 'src/assets/case-property';
import { letterValue } from './../../../assets/reserve-letters';

export class Tile {
    private letter: string = '';
    private value: number = 0;
    private specialProperty: CaseProperty;

    constructor(specialProperty: CaseProperty) {
        this.specialProperty = specialProperty;
    }

    tileContainsLetter(): boolean {
        if (this.letter !== '') {
            return true;
        }
        return false;
    }

    addLetter(letter: string): void {
        this.letter = letter;
        this.value = letterValue[letter];
    }

    removeLetter(): void {
        this.letter = '';
        this.value = 0;
    }

    getLetter(): string {
        return this.letter;
    }

    getValue(): number {
        return this.value;
    }

    getSpecialProperty(): CaseProperty {
        return this.specialProperty;
    }
}
