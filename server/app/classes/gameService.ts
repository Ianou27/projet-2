import { PlayerService } from '@app/../../client/src/app/classes/playerService/playerService';
declare var require: any;
const fs = require('fs');

export class GameService  {
    players:Array<PlayerService>;
    dictionary: string;
    lettersInReserve:Array<String>;


    constructor(){
        this.dictionary = "Mon dictionnaire";
        
    }

    changeTurnTwoPlayers(){
        for(let i = 0; i < this.players.length; i++){
            this.players[i].changeTurn();
        }
    }


/*     To be implemented
    changeDictionary(){} */

    validatedWordDictionary(word:string) : boolean {
        if(word.length < 2 || word.includes("-") || word.includes("'"))
            return false;

        let dictionaryArray: string[] = JSON.parse(fs.readFileSync("./assets/dictionnary.json")).words;
        let leftLimit = 0;
        let rightLimit = dictionaryArray.length - 1;
        while (leftLimit <= rightLimit) {
            let middleLimit = leftLimit + Math.floor((rightLimit - leftLimit) / 2);
            
            //localeCompare helps us know if the word is before(-1), equivalent(0) or after(1)
            let comparisonResult = word.localeCompare(dictionaryArray[middleLimit], 'en', {sensitivity: 'base'});

            if (comparisonResult < 0) {
                rightLimit = middleLimit - 1;
            }
                
            else if (comparisonResult > 0) {
                leftLimit = middleLimit + 1;
            }

            else {
                return true;
            }
                
        }
        return false;
    }
}