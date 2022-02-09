import { GameService } from '@app/classes/game.service';

export class GameManager {
    gameList: GameService;

    constructor() {
        this.gameList = new GameService();
    }

    validatedCommandFormat(commandInformations: string[]): boolean {
        const command = commandInformations[0];
        switch (command) {
            case '!placer': {
                return this.validatedPlaceCommandFormat(commandInformations);
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
        if (commandInformations.length !== 3) {
            return false;
        }
        const command: string = commandInformations.join(' ');
        const oneLetterValidWithoutOrientation = /^!placer ([A-O][1-9]|[A-O][1][0-5]) [a-z A-Z]$/;
        const oneLetterValidWithOrientation = /^!placer ([A-O][1-9][hv]|[A-O][1][0-5][hv]) [a-z A-Z]$/;
        const lettersValidPattern = /^!placer ([A-O][1-9][hv]|[A-O][1][0-5][hv]) [a-z A-Z]+$/;

        return oneLetterValidWithoutOrientation.test(command) || oneLetterValidWithOrientation.test(command) || lettersValidPattern.test(command);
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
