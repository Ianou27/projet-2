import { letterValue } from './../../../../common/assets/reserve-letters';
import { Tile } from './../../../../common/tile/Tile';

export class Player {
    letters: Tile[];
    hisTurn: boolean;
    points: number;

    constructor(letters: Tile[], hisTurn: boolean) {
        this.letters = letters;
        this.hisTurn = hisTurn;
        this.points = 0;
    }

    changeTurn() {
        this.hisTurn = !this.hisTurn;
    }

    getLetters(): Tile[] {
        return this.letters;
    }

    getHisTurn(): boolean {
        return this.hisTurn;
    }

    lettersToStringArray(): string[] {
        const lettersPlayer = [];
        for (const letterTile of this.letters) {
            lettersPlayer.push(letterTile.letter);
        }
        return lettersPlayer;
    }

    changeLetter(removeLetter: string, newLetter: string): void {
        for (const letterPlayer of this.letters) {
            if (this.isUpper(removeLetter) && letterPlayer.letter === '*') {
                letterPlayer.letter = newLetter.toUpperCase();
                letterPlayer.value = letterValue[newLetter];
                break;
            }
            if (!this.isUpper(removeLetter) && letterPlayer.letter === removeLetter.toUpperCase()) {
                letterPlayer.letter = newLetter.toUpperCase();
                letterPlayer.value = letterValue[newLetter];
                break;
            }
        }
    }

    private isUpper(letter: string) {
        return /[A-Z]/.test(letter);
    }
}
