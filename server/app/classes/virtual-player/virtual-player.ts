import { INDEX_OF_NOT_FOUND } from '@common/constants/general-constants';
import { PlacementCommand } from './../placementCommand/placement-command';
import { Player } from './../player/player';

export class VirtualPlayer {
    words: string[] = [];

    findAllWords(player: Player) {
        let validWords: string[] = [];
        let combinations = this.getCombinations(player.lettersToStringArray().map((letter) => letter.toLowerCase())).filter((item) => {
            return item.length < 7;
        });
        const middleIndex = Math.ceil(combinations.length);
        combinations = combinations.splice(-middleIndex);
        for (const combination of combinations) {
            this.heapsPermute(combination.split(''), 0);
        }
        this.words = [...new Set(this.words)];
        for (const word of this.words) {
            if (PlacementCommand.validatedWordDictionary(word)) {
                validWords = validWords.concat(word);
            }
            if (validWords.length >= 20) {
                break;
            }
        }
        return validWords;
    }

    heapsPermute(array: string[], n: number) {
        n = n || array.length;
        let j = 0;
        if (n === 1) {
            this.words.push(array.join(''));
        } else {
            for (let i = 1; i <= n; i += 1) {
                this.heapsPermute(array, n - 1);
                if (n % 2) {
                    j = 1;
                } else {
                    j = i;
                }
                this.swap(array, j - 1, n - 1);
            }
        }
    }

    swap(array: string[], pos1: number, pos2: number) {
        const temp = array[pos1];
        array[pos1] = array[pos2];
        array[pos2] = temp;
    }

    getCombinations(chars: string[]) {
        const result: string[] = [];
        if (chars.indexOf('*') !== INDEX_OF_NOT_FOUND) {
            chars[chars.indexOf('*')] = this.getRandomLetterForBlank();
        }
        const func = (prefix: string, array: string[]) => {
            for (let i = 0; i < array.length; i++) {
                result.push(prefix + array[i]);
                func(prefix + array[i], array.slice(i + 1));
            }
        };
        func('', chars);
        return result;
    }

    getRandomLetterForBlank(): string {
        const randomLetters = ['A', 'E', 'I', 'L', 'O', 'N'];
        return randomLetters[Math.floor(Math.random() * randomLetters.length)];
    }
}
