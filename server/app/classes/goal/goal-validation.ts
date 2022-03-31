import { Tile } from '@common/tile/Tile';

export class Goal {
    // static validationGoal(): number {}
    static tripleE(words: Tile[][]): boolean {
        let eCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.letter.toUpperCase() === 'E') {
                    eCount++;
                }
                if (eCount === 3) return true;
            }
            eCount = 0;
        }
        return false;
    }

    static threeWords(words: Tile[][]): boolean {
        return words.length >= 3;
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
            if (word.length >= 8) return true;
        }
        return false;
    }

    static hasTwoStars(words: Tile[][]): boolean {
        let starCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === 0) starCount++;
                if (starCount === 2) return true;
            }
            starCount = 0;
        }
        return false;
    }

    static twoTenPointsLetters(words: Tile[][]): boolean {
        let counter = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === 10) {
                    counter++;
                }
                if (counter === 2) return true;
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
