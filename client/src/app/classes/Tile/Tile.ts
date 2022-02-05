import { caseProperty } from './../../../assets/caseProperty';

export class Tile {
    private letter: string = '';
    private position: number[];
    private specialProperty: caseProperty;

    constructor(position: number[], specialProperty: caseProperty) {
        this.position = position;
        this.specialProperty = specialProperty;
    }

    tileContainsLetter(): boolean {
        if (this.letter !== '') {
            return true;
        }
        return false;
    }

    getSpecialProperty(): caseProperty {
        return this.specialProperty;
    }

    addLetter(letter: string): void {
        this.letter = letter;
    }

    getLetter(): string {
        return this.letter;
    }

    getPosition(): number[] {
        return this.position;
    }
}
