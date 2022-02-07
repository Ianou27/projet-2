import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';
import { GameBoardService } from '@app/../../client/src/app/services/game-board/game-board.service';
import { RowTest } from 'assets/row';

/* declare let require: unknown;
const fs = require('fs'); */

export class GameService {
    private player1: PlayerService;
    private player2: PlayerService;
    /* private dictionary: string; */
    private gameBoard: GameBoardService;

    constructor() {
        /* this.dictionary = "Mon dictionnaire"; */
        /*         this.gameBoard = new GameBoardService(); */
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

    /*     !placer h8v bon */
    validatedCommandFormat(commandInformations: string[]) {
        const command = commandInformations[0];
        switch (command) {
            case '!placer': {
                this.validatedPlaceCommand(commandInformations);
                break;
            }
            /*             case '!passer': {
                return this.validatedPassCommand(commandInformations);
            }
            case '!échanger': {
                return this.validatedExchangeCommand(commandInformations);
            } */
            // No default
        }
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
        const orientation = positionOrientation.pop();
        const row = positionOrientation.shift();
        const column = Number(positionOrientation.join(''));
        const numberLetters = commandInformations[2].length;

        const orientationValid: boolean = orientation === 'h' || orientation === 'v';
        const columnValid: boolean = 1 <= column && column <= 15;
        const rowValid: boolean = row === undefined ? false : RowTest[row] !== undefined;
        const oneLetterValid: boolean = numberLetters === 1 && columnValid && rowValid;

        const containsLineRowOrientation: boolean = (orientationValid && columnValid && rowValid) || oneLetterValid;
        const lettersTileHolder: boolean = this.tileHolderContains(commandInformations[2]);

        if (containsLineRowOrientation && lettersTileHolder) {
            // methode pour envoyer message chatService
            // missingArgument();
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

    /*private insideBoardGame(orientation: string, row: string, column: string, numberLetters: number): boolean {
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
    }

    validatedWordDictionary(word: string): boolean {
        if (word.length < 2 || word.includes('-') || word.includes("'")) return false;

        const dictionaryArray: string[] = JSON.parse(fs.readFileSync('./assets/dictionnary.json')).words;
        let leftLimit = 0;
        let rightLimit = dictionaryArray.length - 1;
        while (leftLimit <= rightLimit) {
            const middleLimit = leftLimit + Math.floor((rightLimit - leftLimit) / 2);

            // localeCompare helps us know if the word is before(-1), equivalent(0) or after(1)
            const comparisonResult = word.localeCompare(dictionaryArray[middleLimit], 'en', { sensitivity: 'base' });

            if (comparisonResult < 0) {
                rightLimit = middleLimit - 1;
            } else if (comparisonResult > 0) {
                leftLimit = middleLimit + 1;
            } else {
                return true;
            }
        }
        return false;
    } */
}
