import { GameService } from '@app/classes/game.service';
import { COLUMN_ROWS_NUMBER } from '@common/constants/general-constants';
import { RowTest } from './../../assets/row';

export class GameManager {
    gameList: GameService;

    constructor() {
        this.gameList = new GameService();
    }

    validatedCommandFormat(commandInformations: string[]): void {
        const command = commandInformations[0];
        switch (command) {
            case '!placer': {
                // if (!this.validatedPlaceCommandFormat(commandInformations)) return false;
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

    validatedPlaceCommandFormat(commandInformations: string[]): boolean {
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
        const oneLetterValid: boolean = numberLetters === 1;
        const argumentsValid: boolean = this.placePositionOrientationVerification(orientation, row, column);

        return oneLetterValid && argumentsValid;
    }

    private placePositionOrientationVerification(orientation: string, row: string, column: number) {
        if (orientation !== 'h' && orientation !== 'v') return false;
        if (column <= 1 || column >= COLUMN_ROWS_NUMBER) return false;
        if (RowTest[row] === undefined) return false;
        return true;
    }

    /* validatedWordDictionary(word: string): boolean {
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
    }*/
}
