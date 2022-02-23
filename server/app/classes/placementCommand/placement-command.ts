/* import * as fs from 'fs'; */
import { letterValue } from './../../../../common/assets/reserve-letters';
import {
    CENTER_ROW_COLUMN,
    COLUMN_ROWS_MINIMUM,
    COLUMN_ROWS_NUMBER,
    MAXIMUM_LETTERS_PLACE_COMMAND,
    MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT,
    MINIMUM_LETTERS_PLACE_COMMAND,
    MINIMUM_ROW_COLUMN_COMPARISON_LIMIT,
} from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';
import { rowNumber } from './../../../assets/row';
import { PlacementInformations } from './../../placement-informations';
import { Game } from './../game/game';
import { PointsCalculator } from './../pointsCalculator/points-calculator';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let require: any;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-var-requires
export class PlacementCommand {
    static dictionaryArray: string[] = JSON.parse(fs.readFileSync('./assets/dictionnary.json').toString()).words;

    static validatedPlaceCommandFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 3) return false;
        const command: string = commandInformations.join(' ');
        const oneLetterValidWithoutOrientation = /^!placer ([A-O][1-9]|[A-O][1][0-5]) [a-z A-Z]$/;
        const oneLetterValidWithOrientation = /^!placer ([A-O][1-9][hv]|[A-O][1][0-5][hv]) [a-z A-Z]$/;
        const lettersValidPattern = /^!placer ([A-O][1-9][hv]|[A-O][1][0-5][hv]) [a-z A-Z]+$/;
        return oneLetterValidWithoutOrientation.test(command) || oneLetterValidWithOrientation.test(command) || lettersValidPattern.test(command);
    }

    static validatedPlaceCommandBoard(commandInformations: string[], game: Game): boolean {
        const placementInformations = this.separatePlaceCommandInformations(commandInformations);
        const insideBoard: boolean = this.insideBoardGame(placementInformations, game);
        let wordCondition: boolean;
        if (game.gameState.firstTurn) {
            wordCondition = this.firstWordTouchCenter(placementInformations, game);
        } else {
            wordCondition = this.wordHasAdjacent(placementInformations, game);
        }
        const tileHolderContains = game.playerTurn().tileHolderContains(placementInformations.letters.join(''));
        return insideBoard && wordCondition && tileHolderContains;
    }

    static placeWord(commandInformations: string[], game: Game): boolean {
        const placementInformations = this.separatePlaceCommandInformations(commandInformations);

        let letterPositions: Tile[] = [];
        letterPositions = PlacementCommand.place(placementInformations, game);
        if (!this.newWordsValid(commandInformations, game, letterPositions)) {
            this.restoreBoard(game, letterPositions);
            return false;
        } else {
            let lettersToPlace = placementInformations.letters.length;
            while (lettersToPlace > 0) {
                game.playerTurn().changeLetter('', game.reserveLetters.getRandomLetterReserve());
                lettersToPlace--;
            }
            game.gameState.firstTurn = false;
            game.changeTurnTwoPlayers();
            game.gameState.passesCount = 0;
            game.verifyGameState();
        }
        return true;
    }

    private static restoreBoard(game: Game, letterPositions: Tile[]) {
        for (const tile of letterPositions) {
            game.playerTurn().changeLetter('', game.gameBoard.cases[tile.positionX][tile.positionY].letter);
            game.gameBoard.cases[tile.positionX][tile.positionY].letter = '';
            game.gameBoard.cases[tile.positionX][tile.positionY].value = 0;
        }
    }

    private static place(placementInformations: PlacementInformations, game: Game): Tile[] {
        let letterCount = placementInformations.numberLetters;
        let lettersIter = 0;
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        const positions: Tile[] = [];
        while (letterCount > 0) {
            if (game.gameBoard.tileContainsLetter(tile.positionX, tile.positionY)) {
                tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
                continue;
            }
            const letterPlace = placementInformations.letters[lettersIter];
            tile.letter = letterPlace.toUpperCase();
            tile.value = letterValue[letterPlace.toUpperCase()];
            positions.push(tile);
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
            game.playerTurn().changeLetter(letterPlace, '');
            lettersIter++;
            letterCount--;
        }
        return positions;
    }

    private static separatePlaceCommandInformations(commandInformations: string[]): PlacementInformations {
        const positionOrientation = commandInformations[1].split('');
        const row = rowNumber[positionOrientation[0]];
        const numberLetters = commandInformations[2].length;
        const numberLettersCommand = commandInformations[1].length;
        const letters = commandInformations[2].split('');
        let orientation = '';
        let column = 0;
        if (numberLetters === 1 && numberLettersCommand === MINIMUM_LETTERS_PLACE_COMMAND) {
            orientation = 'v';
            column = Number(positionOrientation[1]) - 1;
        } else if (numberLetters === 1 && numberLettersCommand === MAXIMUM_LETTERS_PLACE_COMMAND) {
            orientation = positionOrientation[3];
            column = Number(positionOrientation[1] + positionOrientation[2]) - 1;
        } else if (numberLettersCommand === MAXIMUM_LETTERS_PLACE_COMMAND) {
            orientation = positionOrientation[2];
            column = Number(positionOrientation[1]) - 1;
        } else {
            orientation = positionOrientation[3];
            column = Number(positionOrientation[1] + positionOrientation[2]) - 1;
        }
        const placementInformations: PlacementInformations = {
            row,
            column,
            letters,
            orientation,
            numberLetters,
        };
        return placementInformations;
    }

    private static letterHasAdjacent(row: number, column: number, game: Game): boolean {
        const haveTile: boolean = game.gameBoard.tileContainsLetter(column, row);
        let haveTileUp = false;
        let haveTileDown = false;
        let haveTileLeft = false;
        let haveTileRight = false;
        if (row > MINIMUM_ROW_COLUMN_COMPARISON_LIMIT) haveTileUp = game.gameBoard.tileContainsLetter(column, row - 1);
        if (row < MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT) haveTileDown = game.gameBoard.tileContainsLetter(column, row + 1);
        if (column > MINIMUM_ROW_COLUMN_COMPARISON_LIMIT) haveTileLeft = game.gameBoard.tileContainsLetter(column - 1, row);
        if (column < MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT) haveTileRight = game.gameBoard.tileContainsLetter(column + 1, row);
        return haveTile || haveTileUp || haveTileDown || haveTileLeft || haveTileRight;
    }

    private static wordHasAdjacent(placementInformations: PlacementInformations, game: Game): boolean {
        let numberLettersToPlace = placementInformations.numberLetters;
        let column = placementInformations.column;
        let row = placementInformations.row;
        if (placementInformations.orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(row, column, game)) return true;
                numberLettersToPlace--;
                column++;
            }
        } else {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(row, column, game)) return true;
                numberLettersToPlace--;
                row++;
            }
        }
        return false;
    }

    private static insideBoardGame(placementInformations: PlacementInformations, game: Game): boolean {
        let numberLettersToPlace = placementInformations.numberLetters;
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        while (numberLettersToPlace > 0) {
            try {
                if (!game.gameBoard.tileContainsLetter(tile.positionX, tile.positionY)) numberLettersToPlace--;
                tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
            } catch (error) {
                return false;
            }
        }
        return true;
    }

    private static firstWordTouchCenter(placementInformations: PlacementInformations, game: Game): boolean {
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        for (let i = 0; i < placementInformations.numberLetters; i++) {
            try {
                if (tile.positionX === CENTER_ROW_COLUMN && tile.positionY === CENTER_ROW_COLUMN) return true;
                tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    private static findNewWordsHorizontal(game: Game, placementInformations: PlacementInformations, letterPositions: Tile[]): Tile[][] {
        let column = placementInformations.column;
        let row = placementInformations.row;
        let word: Tile[] = [];
        const wordsFormed: Tile[][] = [];
        while (game.gameBoard.tileContainsLetter(column, placementInformations.row)) {
            if (column === COLUMN_ROWS_MINIMUM) break;
            column--;
        }
        if (column !== COLUMN_ROWS_MINIMUM) column++;
        while (game.gameBoard.tileContainsLetter(column, placementInformations.row)) {
            word = word.concat(game.gameBoard.cases[column][placementInformations.row]);
            column++;
            if (column === COLUMN_ROWS_NUMBER) break;
        }
        wordsFormed.push(word);
        word = [];
        for (const tile of letterPositions) {
            while (game.gameBoard.tileContainsLetter(tile.positionX, row)) {
                if (row === COLUMN_ROWS_MINIMUM) break;
                row--;
            }
            if (row !== COLUMN_ROWS_MINIMUM) row++;
            while (game.gameBoard.tileContainsLetter(tile.positionX, row)) {
                word = word.concat(game.gameBoard.cases[tile.positionX][row]);
                row++;
                if (row === COLUMN_ROWS_NUMBER) break;
            }
            row = placementInformations.row;
            wordsFormed.push(word);
            word = [];
        }
        return wordsFormed;
    }
    private static findNewWordsVertical(game: Game, placementInformations: PlacementInformations, letterPositions: Tile[]): Tile[][] {
        let column = placementInformations.column;
        let row = placementInformations.row;
        let word: Tile[] = [];
        const wordsFormed: Tile[][] = [];
        while (game.gameBoard.tileContainsLetter(column, row)) {
            if (row === COLUMN_ROWS_MINIMUM) break;
            row--;
        }
        if (row !== COLUMN_ROWS_MINIMUM) row++;
        while (game.gameBoard.tileContainsLetter(column, row)) {
            word = word.concat(game.gameBoard.cases[column][row]);
            row++;
            if (row === COLUMN_ROWS_NUMBER) break;
        }
        wordsFormed.push(word);

        word = [];

        for (const tile of letterPositions) {
            while (game.gameBoard.tileContainsLetter(column, tile.positionY)) {
                if (column === COLUMN_ROWS_MINIMUM) break;
                column--;
            }
            if (column !== COLUMN_ROWS_MINIMUM) column++;
            while (game.gameBoard.tileContainsLetter(column, tile.positionY)) {
                word = word.concat(game.gameBoard.cases[column][tile.positionY]);
                column++;
                if (column === COLUMN_ROWS_NUMBER) break;
            }
            column = placementInformations.column;
            wordsFormed.push(word);
            word = [];
        }
        return wordsFormed;
    }

    private static newWordsValid(commandInformations: string[], game: Game, letterPositions: Tile[]): boolean {
        const placementInformations = this.separatePlaceCommandInformations(commandInformations);
        let wordsFormed: Tile[][] = [];
        if (placementInformations.numberLetters === 1 && game.gameState.firstTurn) return false;
        if (placementInformations.orientation === 'h') {
            wordsFormed = this.findNewWordsHorizontal(game, placementInformations, letterPositions);
        } else {
            wordsFormed = this.findNewWordsVertical(game, placementInformations, letterPositions);
        }
        wordsFormed = wordsFormed.filter((item) => {
            return item.length > 1;
        });
        for (const word of wordsFormed) {
            let wordString = '';
            for (const wordLetter of word) {
                wordString = wordString.concat(wordLetter.letter);
            }
            if (!this.validatedWordDictionary(wordString)) return false;
        }
        game.playerTurn().points += PointsCalculator.calculatedPointsPlacement(wordsFormed, letterPositions);
        return true;
    }

    private static validatedWordDictionary(word: string): boolean {
        let leftLimit = 0;
        let rightLimit = this.dictionaryArray.length - 1;
        while (leftLimit <= rightLimit) {
            const middleLimit = leftLimit + Math.floor((rightLimit - leftLimit) / 2);
            // localeCompare helps us know if the word is before(-1), equivalent(0) or after(1)
            const comparisonResult = word.localeCompare(this.dictionaryArray[middleLimit], 'en', { sensitivity: 'base' });
            if (comparisonResult < 0) {
                rightLimit = middleLimit - 1;
            } else if (comparisonResult > 0) {
                leftLimit = middleLimit + 1;
            } else {
                return true;
            }
        }
        return false;
    }
}
