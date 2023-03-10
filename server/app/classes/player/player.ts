import { BotType } from '@common/bot-type';
import { letterValue } from './../../../../common/assets/reserve-letters';
import { Tile } from './../../../../common/tile/Tile';
import { User } from './../../../../common/types';

export class Player {
    letters: Tile[];
    hisTurn: boolean;
    points: number;
    name: string;
    user: User;
    hisBot: boolean;
    typeBot: BotType;

    constructor(letters: Tile[], hisTurn: boolean, name: string, user: User) {
        this.letters = letters;
        this.hisTurn = hisTurn;
        this.points = 0;
        this.name = name;
        this.user = user;
        this.hisBot = false;
        this.typeBot = BotType.NoType;
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

    changeHisBot(hisBot: boolean) {
        this.hisBot = hisBot;
    }

    lettersToStringArray(): string[] {
        let lettersPlayer = [];
        for (const letterTile of this.letters) {
            lettersPlayer.push(letterTile.letter);
        }
        lettersPlayer = lettersPlayer.filter((letter) => {
            return letter !== '';
        });
        return lettersPlayer;
    }

    changeLetter(removeLetter: string, newLetter: string): void {
        for (const letterPlayer of this.letters) {
            const letterIsPresent =
                (this.isUpper(removeLetter) && letterPlayer.letter === '*') ||
                (!this.isUpper(removeLetter) && letterPlayer.letter === removeLetter.toUpperCase());
            if (letterIsPresent) {
                letterPlayer.letter = newLetter.toUpperCase();
                letterPlayer.value = letterValue[newLetter];
                break;
            }
        }
    }

    getNumberLetters(): number {
        let counter = 0;
        for (const tile of this.letters) {
            if (tile.letter !== '') counter++;
        }
        return counter;
    }

    tileHolderContains(word: string): boolean {
        const lettersWord = word.split('');
        const lettersPlayer: string[] = this.lettersToStringArray();
        for (const letter of lettersWord) {
            if (this.isUpper(letter) && this.findLetterTileHolder('*')) {
                lettersPlayer[lettersPlayer.indexOf('*')] = '';
            } else if (!this.isUpper(letter) && this.findLetterTileHolder(letter.toUpperCase())) {
                lettersPlayer[lettersPlayer.indexOf(letter)] = '';
            } else {
                return false;
            }
        }
        return true;
    }

    private findLetterTileHolder(letter: string): boolean {
        const lettersPlayer: Tile[] = this.getLetters();
        for (const letterPlayer of lettersPlayer) {
            if (letterPlayer.letter === letter) {
                return true;
            }
        }
        return false;
    }

    private isUpper(letter: string): boolean {
        return /[A-Z]/.test(letter);
    }
}
