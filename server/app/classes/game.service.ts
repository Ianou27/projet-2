import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';
import { RowTest } from './../../assets/row';
import { GameBoardService } from './../services/gameBoard.service';

/* declare let require: unknown;
const fs = require('fs'); */

export class GameService {
    private player1: PlayerService;
    private player2: PlayerService;
    /* private dictionary: string; */
    gameBoard: GameBoardService;

    constructor() {
        /* this.dictionary = "Mon dictionnaire"; */
        this.player1 = new PlayerService(this.randomShuffleLetters(), true);
        this.player2 = new PlayerService(this.randomShuffleLetters(), true);
        this.gameBoard = new GameBoardService();
    }

    changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
    }

    randomShuffleLetters(): string[] {
        return [];
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

        const containsLineRowOrientation: boolean = (orientationValid && columnValid && rowValid) || oneLetterValid;
        const lettersTileHolder: boolean = this.tileHolderContains(commandInformations[2]);

        if (containsLineRowOrientation && lettersTileHolder) {
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

    /* private insideBoardGame(orientation: string, row: string, column: string, numberLetters: number): boolean {
        if (orientation === 'h') {
        }
        return true;
    }*/

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
