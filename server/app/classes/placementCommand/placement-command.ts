import {
    CENTER_ROW_COLUMN,
    MAXIMUM_LETTERS_PLACE_COMMAND,
    MAXIMUM_ROW_COLUMN,
    MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT,
    MINIMUM_LETTERS_PLACE_COMMAND,
    MINIMUM_ROW_COLUMN_COMPARISON_LIMIT,
} from '@common/constants/general-constants';
import { RowTest } from './../../../assets/row';
import { PlacementInformations } from './../../placement-informations';
import { Game } from './../game/game';

export class PlacementCommand {
    static validatedPlaceCommandFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 3) {
            return false;
        }
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
        if (game.firstTurn) {
            wordCondition = this.firstWordTouchCenter(placementInformations);
        } else {
            wordCondition = this.wordHasAdjacent(placementInformations, game);
        }

        const tileHolderContains = game.tileHolderContains(placementInformations);

        return insideBoard && wordCondition && tileHolderContains;
    }

    static placeWord(commandInformations: string[], game: Game): boolean {
        const placementInformations = this.separatePlaceCommandInformations(commandInformations);
        game.firstTurn = false;
        switch (placementInformations.orientation) {
            case 'h': {
                this.placeWordHorizontal(placementInformations, game);
                return true;
            }
            case 'v': {
                this.placeWordVertical(placementInformations, game);
                return true;
            }
        }
        return false;
    }

    private static placeWordHorizontal(placementInformations: PlacementInformations, game: Game) {
        let letterCount = placementInformations.numberLetters;
        let iter = 0;
        let lettersIter = 0;
        while (letterCount > 0) {
            if (game.gameBoard.tileContainsLetter(placementInformations.column + iter, placementInformations.row)) {
                iter++;
                continue;
            }
            const letterPlace = placementInformations.letters[lettersIter];
            game.gameBoard.addLetterTile(placementInformations.column + iter, placementInformations.row, letterPlace);
            game.playerTurn().changeLetter(letterPlace, game.getRandomLetterReserve());
            lettersIter++;
            iter++;
            letterCount--;
        }
    }

    private static placeWordVertical(placementInformations: PlacementInformations, game: Game) {
        let letterCount = placementInformations.letters.length;
        let iter = 0;
        let lettersIter = 0;
        while (letterCount > 0) {
            if (game.gameBoard.tileContainsLetter(placementInformations.column, placementInformations.row + iter)) {
                iter++;
                continue;
            }
            const letterPlace = placementInformations.letters[lettersIter];
            game.gameBoard.addLetterTile(placementInformations.column, placementInformations.row + iter, letterPlace);
            game.playerTurn().changeLetter(letterPlace, game.getRandomLetterReserve());
            lettersIter++;
            iter++;
            letterCount--;
        }
    }

    private static separatePlaceCommandInformations(commandInformations: string[]): PlacementInformations {
        const positionOrientation = commandInformations[1].split('');
        const row = RowTest[positionOrientation[0]];
        const numberLetters = commandInformations[2].length;
        const numberLettersCommand = commandInformations[1].length;
        const letters = commandInformations[2].split('');
        let orientation = '';
        let column = 0;
        if (numberLettersCommand === MINIMUM_LETTERS_PLACE_COMMAND) {
            orientation = positionOrientation[2];
            column = Number(positionOrientation[1]) - 1;
        } else if (numberLettersCommand === MAXIMUM_LETTERS_PLACE_COMMAND) {
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
        if (row > MINIMUM_ROW_COLUMN_COMPARISON_LIMIT) {
            haveTileUp = game.gameBoard.tileContainsLetter(column, row - 1);
        }
        if (row < MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT) {
            haveTileDown = game.gameBoard.tileContainsLetter(column, row + 1);
        }
        if (column > MINIMUM_ROW_COLUMN_COMPARISON_LIMIT) {
            haveTileLeft = game.gameBoard.tileContainsLetter(column - 1, row);
        }
        if (column < MAXIMUM_ROW_COLUMN_COMPARISON_LIMIT) {
            haveTileRight = game.gameBoard.tileContainsLetter(column + 1, row);
        }

        return haveTile || haveTileUp || haveTileDown || haveTileLeft || haveTileRight;
    }

    private static wordHasAdjacent(placementInformations: PlacementInformations, game: Game): boolean {
        let numberLettersToPlace = placementInformations.numberLetters;
        let column = placementInformations.column;
        let row = placementInformations.row;
        if (placementInformations.orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(row, column, game)) {
                    return true;
                }
                numberLettersToPlace--;
                column++;
            }
        } else if (placementInformations.orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(row, column, game)) {
                    return true;
                }
                numberLettersToPlace--;
                row++;
            }
        }
        return false;
    }

    private static insideBoardGame(placementInformations: PlacementInformations, game: Game): boolean {
        let row = placementInformations.row;
        let column = placementInformations.column;
        let numberLettersToPlace = placementInformations.numberLetters;
        if (placementInformations.orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (column > MAXIMUM_ROW_COLUMN) {
                    return false;
                }

                if (!game.gameBoard.tileContainsLetter(column, row)) {
                    numberLettersToPlace--;
                }
                column++;
            }
        } else if (placementInformations.orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (row > MAXIMUM_ROW_COLUMN) {
                    return false;
                }
                if (!game.gameBoard.tileContainsLetter(column, row)) {
                    numberLettersToPlace--;
                }
                row++;
            }
        }
        return true;
    }

    private static firstWordTouchCenter(placementInformations: PlacementInformations): boolean {
        let letterPlacement;
        if (placementInformations.orientation === 'h') {
            for (let i = 0; i < placementInformations.numberLetters; i++) {
                letterPlacement = placementInformations.column + i;
                if (letterPlacement === CENTER_ROW_COLUMN && placementInformations.row === CENTER_ROW_COLUMN) {
                    return true;
                }
            }
        } else if (placementInformations.orientation === 'v') {
            for (let i = 0; i < placementInformations.numberLetters; i++) {
                letterPlacement = placementInformations.row + i;
                if (letterPlacement === CENTER_ROW_COLUMN && placementInformations.column === CENTER_ROW_COLUMN) {
                    return true;
                }
            }
        }
        return false;
    }
}
