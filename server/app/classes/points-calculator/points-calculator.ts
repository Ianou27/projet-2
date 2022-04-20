import { CaseProperty } from './../../../../common/assets/case-property';
import {
    NUMBER_TILE_HOLDER,
    POINTS_SEVEN_LETTERS_PLACEMENT,
    WORD_LETTER_2X_MULTIPLIER,
    WORD_LETTER_3X_MULTIPLIER,
    WORD_LETTER_NO_MULTIPLIER,
} from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';
export class PointsCalculator {
    static calculatedPointsPlacement(wordsFormed: Tile[][], newTile: Tile[]): number {
        let total = 0;
        if (newTile.length === NUMBER_TILE_HOLDER) {
            total += POINTS_SEVEN_LETTERS_PLACEMENT;
        }
        for (const word of wordsFormed) {
            let totalOneWord = 0;
            let wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
            for (const letterTile of word) {
                let letterMultiplier = WORD_LETTER_NO_MULTIPLIER;
                if (this.newLetterOnBoard(letterTile, newTile)) {
                    letterMultiplier = this.specialPropertyLetter(letterTile);
                    wordMultiplier = this.specialPropertyWord(letterTile, wordMultiplier);
                }
                totalOneWord += letterTile.value * letterMultiplier;
            }
            total += totalOneWord * wordMultiplier;
        }

        return total;
    }

    static specialPropertyLetter(letterTile: Tile): number {
        const specialProperty = letterTile.specialProperty;
        if (specialProperty === CaseProperty.LetterDouble) return WORD_LETTER_2X_MULTIPLIER;
        if (specialProperty === CaseProperty.LetterTriple) return WORD_LETTER_3X_MULTIPLIER;
        return WORD_LETTER_NO_MULTIPLIER;
    }

    static specialPropertyWord(letterTile: Tile, wordMultiplier: number): number {
        const specialProperty = letterTile.specialProperty;
        let multiplier = WORD_LETTER_NO_MULTIPLIER;
        if (specialProperty === CaseProperty.WordDouble) multiplier = WORD_LETTER_2X_MULTIPLIER;
        if (specialProperty === CaseProperty.WordTriple) multiplier = WORD_LETTER_3X_MULTIPLIER;
        if (multiplier === WORD_LETTER_NO_MULTIPLIER) return wordMultiplier;
        return multiplier;
    }

    static newLetterOnBoard(letter: Tile, newLetters: Tile[]): boolean {
        for (const newLetter of newLetters) {
            if (letter.positionX === newLetter.positionX && letter.positionY === newLetter.positionY) {
                return true;
            }
        }
        return false;
    }
}
