import { CaseProperty } from './../../../../common/assets/case-property';
import {
    INDEX_OF_NOT_FOUND,
    NUMBER_TILEHOLDER,
    POINTS_SEVEN_LETTERS_PLACEMENT,
    WORD_LETTER_2X_MULTIPLIER,
    WORD_LETTER_3X_MULTIPLIER,
    WORD_LETTER_NO_MULTIPLIER,
} from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';
import { PlacementInformations } from './../../placement-informations';
import { Game } from './../game/game';
export class PointsCalculator {
    static calculatedPointsPlacement(wordsFormed: Tile[][], letterPositions: number[], placementInformations: PlacementInformations, game: Game) {
        let total = 0;
        for (const word of wordsFormed) {
            let totalOneWord = 0;
            let wordMultiplier = WORD_LETTER_NO_MULTIPLIER;
            for (const letterTile of word) {
                let row = 0;
                let column = 0;
                let letterMultiplier = WORD_LETTER_NO_MULTIPLIER;
                if (this.newLetterOnBoard(letterTile, letterPositions, placementInformations)) {
                    if (placementInformations.orientation === 'h') {
                        row = placementInformations.row;
                        column = letterTile.positionX;
                    } else {
                        row = letterTile.positionY;
                        column = placementInformations.column;
                    }
                    letterMultiplier = this.specialPropertyLetter(column, row, game);
                    wordMultiplier = this.specialPropertyWord(column, row, game, wordMultiplier);
                }
                totalOneWord += letterTile.value * letterMultiplier;
            }
            total += totalOneWord * wordMultiplier;
        }
        if (letterPositions.length === NUMBER_TILEHOLDER) {
            total += POINTS_SEVEN_LETTERS_PLACEMENT;
        }
        return total;
    }

    static specialPropertyLetter(column: number, row: number, game: Game): number {
        const specialProperty = game.gameBoard.cases[column][row].specialProperty;
        if (specialProperty === CaseProperty.LetterDouble) return WORD_LETTER_2X_MULTIPLIER;
        if (specialProperty === CaseProperty.LetterTriple) return WORD_LETTER_3X_MULTIPLIER;
        return WORD_LETTER_NO_MULTIPLIER;
    }

    static specialPropertyWord(column: number, row: number, game: Game, wordMultiplier: number): number {
        const specialProperty = game.gameBoard.cases[column][row].specialProperty;
        let multiplier = WORD_LETTER_NO_MULTIPLIER;
        if (specialProperty === CaseProperty.WordDouble) multiplier = WORD_LETTER_2X_MULTIPLIER;
        if (specialProperty === CaseProperty.WordTriple) multiplier = WORD_LETTER_3X_MULTIPLIER;
        if (multiplier === WORD_LETTER_NO_MULTIPLIER) return wordMultiplier;
        return multiplier;
    }

    static newLetterOnBoard(letter: Tile, letterPositions: number[], placementInformations: PlacementInformations): boolean {
        if (placementInformations.orientation === 'h') {
            return letter.positionY === placementInformations.row && letterPositions.indexOf(letter.positionX) !== INDEX_OF_NOT_FOUND;
        }
        return letter.positionX === placementInformations.column && letterPositions.indexOf(letter.positionY) !== INDEX_OF_NOT_FOUND;
    }
}
