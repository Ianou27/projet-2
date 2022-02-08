import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';
import { letterNumber } from './../../../common/assets/reserve-letters';
import { RowTest } from './../../assets/row';
import { GameBoardService } from './../services/gameBoard.service';

export class GameService {
    gameBoard: GameBoardService;
    private player1: PlayerService;
    private player2: PlayerService;
    private reserveLetters: string[] = [];
    /* private dictionary: string; */

    constructor() {
        /* this.dictionary = "Mon dictionnaire"; */
        this.player1 = new PlayerService(this.randomLettersInitialisation(), true);
        this.player2 = new PlayerService(this.randomLettersInitialisation(), false);
        this.gameBoard = new GameBoardService();
        this.reserveLetters = this.initializeReserveLetters();
    }

    changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
    }

    placeWord(row: string, column: number, orientation: string, word: string) {
        const letters = word.split('');
        switch (orientation) {
            case 'h': {
                for (let i = 0; i < letters.length; i++) {
                    this.gameBoard.addLetterTile(column + i, RowTest[row], letters[i]);
                }
                break;
            }
        }
    }

    validatedPlaceCommand(commandInformations: string[]): void {
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

        const orientationValid: boolean = orientation === 'h' || orientation === 'v';
        const columnValid: boolean = 1 <= column && column <= 15;
        const rowValid: boolean = row === undefined ? false : RowTest[row] !== undefined;
        const oneLetterValid: boolean = numberLetters === 1 && columnValid && rowValid;

        const validLineRowOrientation: boolean = (orientationValid && columnValid && rowValid) || oneLetterValid;
        const lettersTileHolder: boolean = this.tileHolderContains(commandInformations[2]);
        const insideBoardGame: boolean = this.insideBoardGame(orientation, row, column, numberLetters);

        if (validLineRowOrientation && lettersTileHolder && insideBoardGame) {
            this.placeWord(row, column, orientation, commandInformations[2]);
        } else {
            // methode pour envoyer message chatService
            // missingArgument();
        }
    }

    playerTurn(): PlayerService {
        if (this.player1.getHisTurn()) {
            return this.player1;
        } else {
            return this.player2;
        }
    }

    /*     private touchOtherLetters(orientation: string, row: string, column: number, numberLetters: number): boolean {
        return true;
    } */

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

    private randomLettersInitialisation(): string[] {
        const letters: string[] = [];
        for (let i = 0; i < 7; i++) {
            letters.push(this.getRandomLetterReserve());
        }
        return letters;
    }

    /*     private firstTurn(): boolean {
        const cases = this.gameBoard.cases;
        for (const row of cases) {
            for (const tile of row) {
                if (tile.tileContainsLetter()) {
                    return false;
                }
            }
        }
        return true;
    } */

    /*     validatedWord(newLettersPositions: { position: number[]; letter: string }[]): boolean {
        for (const letter of newLettersPositions) {
            const position = letter.position;
            if (this.gameBoard.tileContainsLetter(position)) {
                return false;
            }

            const positionUp = [];
            positionUp[0] = letter.position[0];
            positionUp[1] = letter.position[0] - 1;

            const positionDown = [];
            positionDown[0] = letter.position[0];
            positionDown[1] = letter.position[0] + 1;

            const positionLeft = [];
            positionLeft[0] = letter.position[0] - 1;
            positionLeft[1] = letter.position[0];

            const positionRight = [];
            positionRight[0] = letter.position[0] + 1;
            positionRight[1] = letter.position[0];
        }

        return true;
    }*/
}
