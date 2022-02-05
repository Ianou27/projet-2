export class Tile {
    letter: string;
    value: number;

    constructor(letter: string, value: number) {
        this.letter = letter;
        this.value = value;
    }

    tileContainsLetter(): boolean {
        if (this.letter !== '') {
            return true;
        }
        return false;
    }
}
