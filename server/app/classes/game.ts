declare var require: any
const fs = require('fs');

export class Game  {
    turnPlayerOne: boolean;
    dictionary: string;

    constructor(){
        this.turnPlayerOne = true;
        this.dictionary = "Mon dictionnaire";

    }

/*     changeTurn(){
        this.turnPlayerOne = !this.turnPlayerOne;
    } */

/*     To be implemented
    changeDictionary(){} */

    validatedWord(word:string) : boolean {
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