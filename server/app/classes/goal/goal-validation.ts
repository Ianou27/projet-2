import {
    EIGHT_LETTERS_VALIDATION,
    LETTER_VALUE_TEN,
    SPECIAL_TILE_X,
    SPECIAL_TILE_Y,
    THREE_LETTERS_OR_WORDS_VALIDATION,
    TWO_LETTERS_OR_WORDS_VALIDATION,
} from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';

export class Goal {
    /* static validationGoal(goals: Goals): number {
        const bonusPoints = 0;
    }*/
    static tripleE(words: Tile[][]): boolean {
        let eCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.letter.toUpperCase() === 'E') {
                    eCount++;
                }
                if (eCount === THREE_LETTERS_OR_WORDS_VALIDATION) return true;
            }
            eCount = 0;
        }
        return false;
    }

    static specialTile(words: Tile[][]): boolean {
        for (const word of words) {
            for (const tile of word) {
                if (tile.positionX === SPECIAL_TILE_X && tile.positionY === SPECIAL_TILE_Y) return true;
            }
        }
        return false;
    }

    static threeWords(words: Tile[][]): boolean {
        return words.length >= THREE_LETTERS_OR_WORDS_VALIDATION;
    }

    static isPalindrome(words: Tile[][]): boolean {
        let i = 0;
        let j = words[0].length - 1;
        for (const word of words) {
            while (i <= j) {
                if (word[i].letter !== word[j].letter) {
                    return false;
                }
                i++;
                j--;
            }
        }
        return true;
    }

    static hasEightLetters(words: Tile[][]): boolean {
        for (const word of words) {
            if (word.length >= EIGHT_LETTERS_VALIDATION) return true;
        }
        return false;
    }

    static hasTwoStars(words: Tile[][]): boolean {
        let starCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === 0) starCount++;
                if (starCount === TWO_LETTERS_OR_WORDS_VALIDATION) return true;
            }
            starCount = 0;
        }
        return false;
    }

    static twoTenPointsLetters(words: Tile[][]): boolean {
        let counter = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === LETTER_VALUE_TEN) {
                    counter++;
                }
                if (counter === TWO_LETTERS_OR_WORDS_VALIDATION) return true;
            }
            counter = 0;
        }
        return false;
    }

    static hasWordScrabble(words: Tile[][]): boolean {
        const wordScrabble = ['S', 'C', 'R', 'A', 'B', 'B', 'L', 'E'];
        let counter = 0;
        for (const word of words) {
            for (let i = 0; i < wordScrabble.length; i++) {
                if (word[i].letter === wordScrabble[i]) {
                    counter++;
                    if (counter === wordScrabble.length - 1) return true;
                    continue;
                }
                break;
            }
            counter = 0;
        }
        return false;
    }
}
