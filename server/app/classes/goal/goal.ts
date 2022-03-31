import { Tile } from '@common/tile/Tile';

export class Goal {
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
}
