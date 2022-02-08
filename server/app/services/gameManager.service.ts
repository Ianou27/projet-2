import { GameService } from '@app/classes/game.service';

export class GameManager {
    gameList: GameService;

    constructor() {
        this.gameList = new GameService();
    }

    validatedCommandFormat(commandInformations: string[]) {
        const command = commandInformations[0];
        switch (command) {
            case '!placer': {
                this.gameList.validatedPlaceCommand(commandInformations);
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
