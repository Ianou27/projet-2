import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { PlacementInformations } from './../../placement-informations';
import { Game } from './../game/game';
export class PointsCalculator {
    static calculatedPointsPlacement(wordsFormed: Tile[][], letterPositions: number[], placementInformations: PlacementInformations, game: Game) {
        let total = 0;
        for (const word of wordsFormed) {
            let totalOneWord = 0;
            let wordMultiplier = 1;
            for (const letterTile of word) {
                let row = 0;
                let column = 0;
                let letterMultiplier = 1;
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
                totalOneWord += letterValue[letterTile.letter] * letterMultiplier;
            }
            total += totalOneWord * wordMultiplier;
        }
        if (letterPositions.length === 7) {
            total += 50;
        }
        return total;
    }

    private static specialPropertyLetter(column: number, row: number, game: Game): number {
        const specialProperty = game.gameBoard.cases[column][row].getSpecialProperty();
        if (specialProperty === CaseProperty.LetterDouble) return 2;
        if (specialProperty === CaseProperty.LetterTriple) return 3;
        return 1;
    }

    private static specialPropertyWord(column: number, row: number, game: Game, wordMultiplier: number): number {
        const specialProperty = game.gameBoard.cases[column][row].getSpecialProperty();
        let multiplier = 1;
        if (specialProperty === CaseProperty.WordDouble) multiplier = 2;
        if (specialProperty === CaseProperty.WordTriple) multiplier = 3;
        if (multiplier === 1) return wordMultiplier;
        return multiplier;
    }

    private static newLetterOnBoard(letter: Tile, letterPositions: number[], placementInformations: PlacementInformations): boolean {
        if (placementInformations.orientation === 'h') {
            return letter.positionY === placementInformations.row && letterPositions.indexOf(letter.positionX) !== -1;
        }
        return letter.positionX === placementInformations.column && letterPositions.indexOf(letter.positionY) !== -1;
    }
}
