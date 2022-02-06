import { PlayerService } from '@app/../../client/src/app/classes/player/player.service';

/* declare let require: unknown;
const fs = require('fs'); */

export class GameService {
    private player1: PlayerService;
    private player2: PlayerService;
    /* private dictionary: string; */
    /*     private gameBoard: GameBoardService; */

    constructor() {
        /* this.dictionary = "Mon dictionnaire"; */
        /*         this.gameBoard = new GameBoardService(); */
        this.player1 = new PlayerService(this.randomShuffleLetters(), true);
        this.player2 = new PlayerService(this.randomShuffleLetters(), true);
    }

    changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
    }

    randomShuffleLetters(): string[] {
        return [];
    }
    /*     !placer h8v bon */
    validatedCommandFormat(commandInformations: string[]): boolean {
        const command = commandInformations[0];
        switch (command) {
            case '!placer': {
                return this.validatedPlaceCommand(commandInformations);
            }
            case '!passer': {
                return this.validatedPassCommand(commandInformations);
            }
            case '!échanger': {
                return this.validatedExchangeCommand(commandInformations);
            }
            // No default
        }
    }

    validatedPlaceCommand(commandInformations: string[]): boolean {
        const positionOrientation = commandInformations[1].split('');
        const orientation = positionOrientation.pop();
        const row = positionOrientation.shift();
        const column = Number(positionOrientation.join(''));
        const orientationValid: boolean = orientation === 'h' || orientation === 'v';
        const columnValid: boolean = 1 <= column && column <= 15;
        const rowValid: boolean = row.match([a - h]).length > 0;
        if (orientationValid && columnValid && rowValid) {
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
