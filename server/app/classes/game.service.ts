import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';
import { CENTER_ROW_COLUMN, EXTREMITY_ROW_COLUMN, NUMBER_TILEHOLDER } from '@common/constants/general-constants';
import { letterNumber } from './../../../common/assets/reserve-letters';
import { RowTest } from './../../assets/row';
import { GameBoardService } from './../services/gameBoard.service';

export class GameService {
    gameBoard: GameBoardService;
    firstTurn: boolean;
    private player1: PlayerService;
    private player2: PlayerService;
    private reserveLetters: string[] = [];
    /* private dictionary: string; */

    constructor() {
        /* this.dictionary = "Mon dictionnaire"; */
        this.player1 = new PlayerService(this.randomLettersInitialization(), true);
        this.player2 = new PlayerService(this.randomLettersInitialization(), false);
        this.gameBoard = new GameBoardService();
        this.reserveLetters = this.initializeReserveLetters();
        this.firstTurn = true;
    }

    changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
    }

    placeWord(commandInformations: string[]): boolean {
        const positionOrientation = commandInformations[1].split('');
        const row = positionOrientation[0];
        const numberLetters = commandInformations[1].length;
        let orientation = '';
        let column = 0;
        if (numberLetters === 3) {
            orientation = positionOrientation[2];
            column = Number(positionOrientation[1]) - 1;
        } else if (numberLetters === 4) {
            orientation = positionOrientation[3];
            column = Number(positionOrientation[1] + positionOrientation[2]) - 1;
        }
        const letters = commandInformations[2].split('');
        this.firstTurn = false;
        switch (orientation) {
            case 'h': {
                this.placeWordHorizontal(row, column, letters);
                return true;
            }
            case 'v': {
                this.placeWordVertical(row, column, letters);
                return true;
            }
        }
        return false;
    }

    validatedPlaceCommandBoard(commandInformations: string[]): boolean {
        const positionOrientation = commandInformations[1].split('');
        const row = positionOrientation[0];
        const numberLettersToPlace = commandInformations[2].length;
        const numberLetters = commandInformations[1].length;
        let orientation = '';
        let column = 0;
        if (numberLetters === 3) {
            orientation = positionOrientation[2];
            column = Number(positionOrientation[1]);
        } else if (numberLetters === 4) {
            orientation = positionOrientation[3];
            column = Number(positionOrientation[1] + positionOrientation[2]);
        }
        const insideBoard: boolean = this.insideBoardGame(orientation, row, column, numberLettersToPlace);
        let wordCondition: boolean;
        if (this.firstTurn) {
            wordCondition = this.firstWordTouchCenter(orientation, row, column, numberLettersToPlace);
        } else {
            wordCondition = this.wordHasAdjacent(orientation, row, column, numberLetters);
        }

        // const tileHolderContains = this.tileHolderContains(commandInformations[2]);

        return insideBoard && wordCondition; /* && tileHolderContains ;*/
    }

    playerTurn(): PlayerService {
        if (this.player1.getHisTurn()) {
            return this.player1;
        } else {
            return this.player2;
        }
    }

    private letterHasAdjacent(row: number, column: number): boolean {
        const haveTile: boolean = this.gameBoard.tileContainsLetter(column, row);
        let haveTileUp = false;
        let haveTileDown = false;
        let haveTileLeft = false;
        let haveTileRight = false;
        if (row > 1) {
            haveTileUp = this.gameBoard.tileContainsLetter(column, row - 1);
        }
        if (row < 13) {
            haveTileDown = this.gameBoard.tileContainsLetter(column, row + 1);
        }
        if (column > 1) {
            haveTileLeft = this.gameBoard.tileContainsLetter(column - 1, row);
        }
        if (column < 13) {
            haveTileRight = this.gameBoard.tileContainsLetter(column + 1, row);
        }

        return haveTile || haveTileUp || haveTileDown || haveTileLeft || haveTileRight;
    }

    private wordHasAdjacent(orientation: string, row: string, column: number, numberLetters: number): boolean {
        let rowNumber = RowTest[row];
        let columnNumber = column - 1;
        let numberLettersToPlace = numberLetters;
        if (orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(rowNumber, columnNumber)) {
                    return true;
                }
                numberLettersToPlace--;
                columnNumber++;
            }
        } else if (orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(rowNumber, columnNumber)) {
                    return true;
                } else if (!this.gameBoard.tileContainsLetter(rowNumber, columnNumber)) {
                    numberLettersToPlace--;
                }
                rowNumber++;
            }
        }
        return false;
    }

    private insideBoardGame(orientation: string, row: string, column: number, numberLetters: number): boolean {
        let rowNumber = RowTest[row];
        let columnNumber = column - 1;
        let numberLettersToPlace = numberLetters;
        if (orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (columnNumber > EXTREMITY_ROW_COLUMN) {
                    return false;
                }

                if (!this.gameBoard.tileContainsLetter(columnNumber, rowNumber)) {
                    numberLettersToPlace--;
                }
                columnNumber++;
            }
        } else if (orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (rowNumber > EXTREMITY_ROW_COLUMN) {
                    return false;
                }
                if (!this.gameBoard.tileContainsLetter(column, rowNumber)) {
                    numberLettersToPlace--;
                }
                rowNumber++;
            }
        }
        return true;
    }

    private firstWordTouchCenter(orientation: string, row: string, column: number, numberLetters: number): boolean {
        let letterPlacement;
        const rowNumber = RowTest[row];
        const columnNumber = column - 1;
        if (orientation === 'h') {
            for (let i = 0; i < numberLetters; i++) {
                letterPlacement = columnNumber + i;
                if (letterPlacement === CENTER_ROW_COLUMN && RowTest[row] === CENTER_ROW_COLUMN) {
                    return true;
                }
            }
        } else if (orientation === 'v') {
            for (let i = 0; i < numberLetters; i++) {
                letterPlacement = rowNumber + i;
                if (letterPlacement === CENTER_ROW_COLUMN && columnNumber === CENTER_ROW_COLUMN) {
                    return true;
                }
            }
        }
        return false;
    }

    /* private isUpperCase(letter: string): boolean {
        return letter === letter.toUpperCase();
    }*/

    /*     private tileHolderContains(word: string): boolean {
        const letters = word.split('');
        const player: PlayerService = this.playerTurn();
        const lettersPlayer: string[] = player.getLetters();
        for (const letter of letters) {
            if (this.isUpperCase(letter)) {
                if (!lettersPlayer.includes('*')) {
                    return false;
                }
                lettersPlayer.splice(lettersPlayer.indexOf('*'), 1);
            } else {
                if (!lettersPlayer.includes(letter)) {
                    return false;
                }
                lettersPlayer.splice(lettersPlayer.indexOf(letter), 1);
            }
        }
        return true;
    } */

    private placeWordHorizontal(row: string, column: number, letters: string[]) {
        let letterCount = letters.length;
        let iter = 0;
        let lettersIter = 0;
        while (letterCount > 0) {
            if (this.gameBoard.tileContainsLetter(column + iter, RowTest[row])) {
                iter++;
                continue;
            }
            this.gameBoard.addLetterTile(column + iter, RowTest[row], letters[lettersIter]);
            lettersIter++;
            iter++;
            letterCount--;
        }
    }

    private placeWordVertical(row: string, column: number, letters: string[]) {
        let letterCount = letters.length;
        let iter = 0;
        let lettersIter = 0;
        while (letterCount > 0) {
            if (this.gameBoard.tileContainsLetter(column, RowTest[row] + iter)) {
                iter++;
                continue;
            }
            this.gameBoard.addLetterTile(column, RowTest[row] + iter, letters[lettersIter]);
            lettersIter++;
            iter++;
            letterCount--;
        }
    }

    private getRandomLetterReserve(): string {
        const reserveLength = this.reserveLetters.length;
        if (reserveLength === 0) {
            return '';
        }
        const element = this.reserveLetters[Math.floor(Math.random() * this.reserveLetters.length)];
        const indexElement = this.reserveLetters.indexOf(element);
        this.reserveLetters.splice(indexElement, 1);
        return element;
    }

    private initializeReserveLetters(): string[] {
        const reserveLetters = letterNumber;
        const reserve: string[] = [];
        for (const [letter, number] of Object.entries(reserveLetters)) {
            for (let i = 0; i < number; i++) {
                reserve.push(letter);
            }
        }
        return reserve;
    }

    private randomLettersInitialization(): string[] {
        const letters: string[] = [];
        for (let i = 0; i < NUMBER_TILEHOLDER; i++) {
            letters.push(this.getRandomLetterReserve());
        }
        return letters;
    }
}
