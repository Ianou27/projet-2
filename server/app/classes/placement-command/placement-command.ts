import { Orientation } from '@common/orientation';
import { letterValue } from './../../../../common/assets/reserve-letters';
import { rowNumber } from './../../../../common/assets/row';
import {
    CENTER_ROW_COLUMN,
    MAXIMUM_LETTERS_PLACE_COMMAND,
    MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT,
    MIDDLE_LETTERS_PLACE_COMMAND,
    MINIMUM_LETTERS_PLACE_COMMAND,
    MINIMUM_ROW_COLUMN_COMPARISON_LIMIT,
} from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';
import { PlacementInformations } from './../../../assets/placement-informations';
import { Game } from './../game/game';
import { Goal } from './../goal/goal';
import { PointsCalculator } from './../points-calculator/points-calculator';

export class PlacementCommand {
    static validatedPlaceCommandFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 3) return false;
        const command: string = commandInformations.join(' ');
        const oneLetterValidWithoutOrientation = /^!placer ([a-o][1-9]|[a-o][1][0-5]) [a-z A-Z]$/;
        const oneLetterValidWithOrientation = /^!placer ([a-o][1-9][hv]|[a-o][1][0-5][hv]) [a-z A-Z]$/;
        const lettersValidPattern = /^!placer ([a-o][1-9][hv]|[a-o][1][0-5][hv]) [a-z A-Z]+$/;
        return oneLetterValidWithoutOrientation.test(command) || oneLetterValidWithOrientation.test(command) || lettersValidPattern.test(command);
    }

    static validatedPlaceCommandBoard(commandInformations: string[], game: Game): boolean {
        let tileHolderContains: boolean;
        let insideBoard: boolean;
        let wordCondition: boolean;
        try {
            const placementInformations = this.separatePlaceCommandInformations(commandInformations);
            insideBoard = this.insideBoardGame(placementInformations, game);
            wordCondition = game.gameState.firstTurn
                ? this.firstWordTouchCenter(placementInformations, game)
                : this.wordHasAdjacent(placementInformations, game);
            tileHolderContains = game.playerTurn().tileHolderContains(placementInformations.letters.join(''));
            if (game.gameState.firstTurn && placementInformations.numberLetters === 1) return false;
        } catch (error) {
            return false;
        }

        return insideBoard && wordCondition && tileHolderContains;
    }

    static restoreBoard(game: Game, letterPositions: Tile[]) {
        for (const tile of letterPositions) {
            const letterToChange = tile.value === 0 ? '*' : game.gameBoard.cases[tile.positionX][tile.positionY].letter;
            game.playerTurn().changeLetter('', letterToChange);
            game.gameBoard.cases[tile.positionX][tile.positionY].letter = '';
            game.gameBoard.cases[tile.positionX][tile.positionY].value = 0;
        }
    }

    static place(placementInformations: PlacementInformations, game: Game): Tile[] {
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
            if (!this.isUpper(letterPlace)) {
                tile.value = letterValue[letterPlace.toUpperCase()];
            }
            tile.letter = letterPlace.toUpperCase();
            positions.push(tile);
            if (game.gameBoard.isBottomOrLeft(tile, placementInformations.orientation)) break;
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
            game.playerTurn().changeLetter(letterPlace, '');
            lettersIter++;
            letterCount--;
        }
        return positions;
    }

    static isUpper(letter: string): boolean {
        return /[A-Z]/.test(letter);
    }

    static separatePlaceCommandInformations(commandInformations: string[]): PlacementInformations {
        const positionOrientation = commandInformations[1].split('');
        const row = rowNumber[positionOrientation[0]];
        const numberLetters = commandInformations[2].length;
        const numberLettersCommand = commandInformations[1].length;
        const letters = commandInformations[2].split('');
        const hasOrientation =
            positionOrientation[positionOrientation.length - 1] === 'h' || positionOrientation[positionOrientation.length - 1] === 'v';
        let orientation: Orientation;
        let column = 0;
        if (numberLetters === 1 && numberLettersCommand === MINIMUM_LETTERS_PLACE_COMMAND) {
            orientation = Orientation.v;
            column = Number(positionOrientation[1]) - 1;
        } else if (numberLetters === 1 && numberLettersCommand === MIDDLE_LETTERS_PLACE_COMMAND && hasOrientation) {
            orientation = Orientation.h;
            column = Number(positionOrientation[1]) - 1;
        } else if (numberLetters === 1 && numberLettersCommand === MIDDLE_LETTERS_PLACE_COMMAND && !hasOrientation) {
            orientation = Orientation.v;
            column = Number(positionOrientation[1] + positionOrientation[2]) - 1;
        } else if (numberLetters === 1 && numberLettersCommand === MAXIMUM_LETTERS_PLACE_COMMAND) {
            orientation = Orientation.h;
            column = Number(positionOrientation[1] + positionOrientation[2]) - 1;
        } else if (numberLettersCommand === 3) {
            if (positionOrientation[2] === 'h') orientation = Orientation.h;
            else orientation = Orientation.v;
            column = Number(positionOrientation[1]) - 1;
        } else {
            if (positionOrientation[3] === 'h') orientation = Orientation.h;
            else orientation = Orientation.v;
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

    static letterHasAdjacent(column: number, row: number, game: Game): boolean {
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

    static wordHasAdjacent(placementInformations: PlacementInformations, game: Game): boolean {
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        let numberLettersToPlace = placementInformations.numberLetters;
        while (numberLettersToPlace > 0) {
            if (this.letterHasAdjacent(tile.positionX, tile.positionY, game)) return true;
            numberLettersToPlace--;
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
        }
        return false;
    }

    static insideBoardGame(placementInformations: PlacementInformations, game: Game): boolean {
        let numberLettersToPlace = placementInformations.numberLetters - 1;
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

    static firstWordTouchCenter(placementInformations: PlacementInformations, game: Game): boolean {
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

    static findNewWords(game: Game, placementInformations: PlacementInformations, letterPositions: Tile[]): Tile[][] {
        const secondValidationOrientation = placementInformations.orientation === Orientation.h ? Orientation.v : Orientation.h;
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        let word: Tile[] = [];
        const wordsFormed: Tile[][] = [];
        while (this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)) {
            if (game.gameBoard.isTopOrRight(tile, placementInformations.orientation)) break;
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, true);
        }
        if (
            !(
                game.gameBoard.isTopOrRight(tile, placementInformations.orientation) &&
                this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)
            )
        )
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
        while (this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)) {
            word.push(tile);
            if (game.gameBoard.isBottomOrLeft(tile, placementInformations.orientation)) break;
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
        }
        wordsFormed.push(word);
        word = [];
        for (const letter of letterPositions) {
            tile = letter;
            while (this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)) {
                if (game.gameBoard.isTopOrRight(tile, secondValidationOrientation)) break;
                tile = game.gameBoard.nextTile(tile, secondValidationOrientation, true);
            }
            if (
                !(
                    game.gameBoard.isTopOrRight(tile, secondValidationOrientation) &&
                    this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)
                )
            ) {
                tile = game.gameBoard.nextTile(tile, secondValidationOrientation, false);
            }
            while (this.tileContainsLetter(letterPositions, tile.positionX, tile.positionY, game)) {
                word.push(tile);
                if (game.gameBoard.isBottomOrLeft(tile, secondValidationOrientation)) break;
                tile = game.gameBoard.nextTile(tile, secondValidationOrientation, false);
            }
            wordsFormed.push(word);
            word = [];
        }
        return this.verifyWordsFormed(wordsFormed, letterPositions);
    }

    static tileContainsLetter(letterPositions: Tile[], positionX: number, positionY: number, game: Game): boolean {
        for (const letterPosition of letterPositions) {
            if (letterPosition.positionX === positionX && letterPosition.positionY === positionY) return true;
        }
        return game.gameBoard.tileContainsLetter(positionX, positionY);
    }

    static newWordsValid(commandInformations: string[], game: Game, letterPositions: Tile[], isValidation: boolean): number {
        const placementInformations = this.separatePlaceCommandInformations(commandInformations);
        let wordsFormed: Tile[][] = [];
        if (placementInformations.numberLetters === 1 && game.gameState.firstTurn) return 0;
        wordsFormed = this.findNewWords(game, placementInformations, letterPositions);
        wordsFormed = wordsFormed.filter((item) => {
            return item.length > 1;
        });
        for (const word of wordsFormed) {
            let wordString = '';
            for (const wordLetter of word) {
                wordString = wordString.concat(wordLetter.letter);
            }
            if (game.gameState.modeLog && game.goals.scrabble.isInGame && !game.goals.scrabble.isDone && wordString === 'SCRABBLE') continue;
            if (!this.validatedWordDictionary(wordString, game.dictionaryArray)) return 0;
        }
        let score = 0;
        if (!isValidation) score += Goal.validationGoal(wordsFormed, game);
        return score + PointsCalculator.calculatedPointsPlacement(wordsFormed, letterPositions);
    }

    static verifyWordsFormed(wordsFormed: Tile[][], letterPositions: Tile[]): Tile[][] {
        const newWordsFormed: Tile[][] = [];
        for (const wordFormed of wordsFormed) {
            const words: Tile[] = [];
            for (const letter of wordFormed) {
                const newTile = new Tile(letter.specialProperty, letter.positionX, letter.positionY);
                if (letter.letter === '') {
                    newTile.letter = this.findWordLetter(letter, letterPositions);
                    newTile.value = letterValue[newTile.letter];
                } else {
                    newTile.letter = letter.letter;
                    newTile.value = letter.value;
                }
                words.push(newTile);
            }
            newWordsFormed.push(words);
        }
        return newWordsFormed;
    }

    static findWordLetter(tile: Tile, letterPositions: Tile[]): string {
        for (const letterPosition of letterPositions) {
            if (letterPosition.positionX === tile.positionX && letterPosition.positionY === tile.positionY) return letterPosition.letter;
        }
        return '';
    }

    static validatedWordDictionary(word: string, dictionary: string[]): boolean {
        let leftLimit = 0;
        let rightLimit = dictionary.length - 1;
        while (leftLimit <= rightLimit) {
            const middleLimit = leftLimit + Math.floor((rightLimit - leftLimit) / 2);
            // localeCompare helps us know if the word is before(-1), equivalent(0) or after(1)
            const comparisonResult = word.localeCompare(dictionary[middleLimit], 'en', { sensitivity: 'base' });
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

    static placeWord(commandInformations: string[], game: Game): boolean {
        const placementInformations = PlacementCommand.separatePlaceCommandInformations(commandInformations);
        let letterPositions: Tile[] = [];
        letterPositions = PlacementCommand.place(placementInformations, game);
        const placementScore = PlacementCommand.newWordsValid(commandInformations, game, letterPositions, false);
        if (placementScore === 0) {
            PlacementCommand.restoreBoard(game, letterPositions);
            return false;
        }
        let lettersToPlace = placementInformations.letters.length;
        while (lettersToPlace > 0) {
            game.playerTurn().changeLetter('', game.reserveLetters.getRandomLetterReserve());
            lettersToPlace--;
        }
        game.playerTurn().points += placementScore;
        game.gameState.firstTurn = false;
        game.changeTurnTwoPlayers();
        game.timer.reset();
        game.gameState.passesCount = 0;
        game.gameStateUpdate();

        return true;
    }
}
