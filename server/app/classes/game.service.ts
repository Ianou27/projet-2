import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';
import { letterNumber } from './../../../common/assets/reserve-letters';
import { RowTest } from './../../assets/row';
import { GameBoardService } from './../services/gameBoard.service';

export class GameService {
    gameBoard: GameBoardService;
    private player1: PlayerService;
    private player2: PlayerService;
    private reserveLetters: string[] = [];
    private firstTurn: boolean;
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
            column = Number(positionOrientation[1]);
        } else if (numberLetters === 4) {
            orientation = positionOrientation[3];
            column = Number(positionOrientation[1] + positionOrientation[2]);
        }
        const letters = commandInformations[2].split('');
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
        const insideBoard: boolean = this.insideBoardGame(orientation, row, column, numberLetters);
        const firstWordCondition = this.firstTurn && this.firstWordTouchCenter(orientation, row, column, numberLetters);
        const nextWordCondition = this.wordHasAdjacent(orientation, row, column, numberLetters);
        const tileHolderContains = this.tileHolderContains(commandInformations[2]);

        return insideBoard && (firstWordCondition || nextWordCondition) && tileHolderContains;
    }

    playerTurn(): PlayerService {
        if (this.player1.getHisTurn()) {
            return this.player1;
        } else {
            return this.player2;
        }
    }

    private surroundingRowColumns(rowColumn: number, incrementation: boolean): number {
        if (incrementation && rowColumn < 13) {
            return rowColumn++;
        } else if (rowColumn > 1) {
            return rowColumn--;
        }
        return rowColumn;
    }

    private letterHasAdjacent(row: number, column: number): boolean {
        const cases = this.gameBoard.cases;
        const haveTile: boolean = cases[row][column].tileContainsLetter();
        const haveTileUp: boolean = cases[this.surroundingRowColumns(row, false)][column].tileContainsLetter();
        const haveTileDown: boolean = cases[this.surroundingRowColumns(row, true)][column].tileContainsLetter();
        const haveTileLeft: boolean = cases[row][this.surroundingRowColumns(column, false)].tileContainsLetter();
        const haveTileRight: boolean = cases[row][this.surroundingRowColumns(column, true)].tileContainsLetter();
        if (haveTile || haveTileUp || haveTileDown || haveTileLeft || haveTileRight) {
            return true;
        }
        return false;
    }

    private wordHasAdjacent(orientation: string, row: string, column: number, numberLetters: number): boolean {
        const cases = this.gameBoard.cases;
        let rowNumber = RowTest[row];
        let columnNumber = column - 1;
        let numberLettersToPlace = numberLetters;
        if (orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(rowNumber, columnNumber)) {
                    return true;
                } else if (!cases[rowNumber][columnNumber].tileContainsLetter()) {
                    numberLettersToPlace--;
                }
                columnNumber++;
            }
        } else if (orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (this.letterHasAdjacent(rowNumber, columnNumber)) {
                    return true;
                } else if (!cases[rowNumber][columnNumber].tileContainsLetter()) {
                    numberLettersToPlace--;
                }
                rowNumber++;
            }
        }
        return true;
    }

    private insideBoardGame(orientation: string, row: string, column: number, numberLetters: number): boolean {
        const cases = this.gameBoard.cases;
        let rowNumber = RowTest[row];
        let columnNumber = column - 1;
        let numberLettersToPlace = numberLetters;
        if (orientation === 'h') {
            while (numberLettersToPlace > 0) {
                if (!cases[rowNumber][columnNumber].tileContainsLetter()) {
                    numberLettersToPlace--;
                }
                columnNumber++;
            }
            if (columnNumber > 15) {
                return false;
            }
        } else if (orientation === 'v') {
            while (numberLettersToPlace > 0) {
                if (!cases[rowNumber][columnNumber].tileContainsLetter()) {
                    numberLettersToPlace--;
                }
                rowNumber++;
            }
            if (rowNumber > 15) {
                return false;
            }
        }
        return true;
    }

    private isUpperCase(letter: string): boolean {
        return letter === letter.toUpperCase();
    }

    private tileHolderContains(word: string): boolean {
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

    private placeWordHorizontal(row: string, column: number, letters: string[]) {
        for (let i = 0; i < letters.length; i++) {
            this.gameBoard.addLetterTile(column + i, RowTest[row], letters[i]);
        }
    }

    private placeWordVertical(row: string, column: number, letters: string[]) {
        for (let i = 0; i < letters.length; i++) {
            this.gameBoard.addLetterTile(column, RowTest[row] + i, letters[i]);
        }
    }

    private randomLettersInitialization(): string[] {
        const letters: string[] = [];
        for (let i = 0; i < 7; i++) {
            letters.push(this.getRandomLetterReserve());
        }
        return letters;
    }

    private firstWordTouchCenter(orientation: string, row: string, column: number, numberLetters: number): boolean {
        let letterPlacement;
        const rowNumber = Number(RowTest[row]);
        if (orientation === 'h') {
            for (let i = 0; i < numberLetters; i++) {
                letterPlacement = column + i;
                if (letterPlacement === 8) {
                    return true;
                }
            }
        } else if (orientation === 'v') {
            for (let i = 0; i < numberLetters; i++) {
                letterPlacement = rowNumber + i;
                if (letterPlacement === 8) {
                    return true;
                }
            }
        }
        return false;
    }
}
