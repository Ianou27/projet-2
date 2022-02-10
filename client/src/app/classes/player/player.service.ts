import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';

export class PlayerService {
    private letters: Tile[];
    private hisTurn: boolean;

    constructor(letters: Tile[], hisTurn: boolean) {
        this.letters = letters;
        this.hisTurn = hisTurn;
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

    changeLetter(removeLetter: string, newLetter: string): void {
        for (const letterPlayer of this.letters) {
            if (letterPlayer.letter === removeLetter) {
                letterPlayer.letter = newLetter;
                letterPlayer.value = letterValue[newLetter];
                break;
            }
        }
    }
}
