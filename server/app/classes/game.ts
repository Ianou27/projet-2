declare var require: any


export class Game  {
    turnPlayerOne: boolean;
    dictionary: string;
    dict: any;

    constructor(){
        this.turnPlayerOne = true;
        this.dictionary = "Mon dictionnaire";
        const fs = require('fs');
        const path = require('path');
        this.dict = fs.readFileSync(path.resolve('./dictionnary.json'));
    }

    changeTurn(){
        this.turnPlayerOne = !this.turnPlayerOne;
    }

    //To be implemented
    //changeDictionary(){}

    validatedWord(word:string) : boolean {
        if(word.length < 2)
            return false;

        let dictionaryArray: string | string[] = ["aa","aalenien","aalenienne","aaleniennes","aaleniens","aas","abaca","abacas","abacost","abacosts","abacule","abacules","abaissa","abaissable","abaissables","abaissai","abaissaient","abaissais","abaissait","abaissames","abaissant","abaissante","abaissantes","abaissants","abaissas","abaissasse","abaissassent","abaissasses","abaissassiez","abaissassions","abaissat","abaissates","abaisse","abaissee","abaissees","abaissement","abaissements","abaissent","abaisser","abaissera","abaisserai","abaisseraient","abaisserais","abaisserait","abaisseras","abaisserent","abaisserez","abaisseriez","abaisserions","abaisserons","abaisseront","abaisses","abaisseur","abaisseurs","abaisseuse","abaisseuses","abaissez","abaissiez","abaissions","abaissons","abajoue","abajoues","abale","abales","abalone","abalones","abandon","abandonna","abandonnai","abandonnaient","abandonnais","abandonnait","abandonnames","abandonnant","abandonnas","abandonnasse","abandonnassent","abandonnasses","abandonnassiez","abandonnassions","abandonnat","abandonnataire","abandonnataires","abandonnates","abandonnateur","abandonnateurs","abandonnatrice","abandonnatrices","abandonne","abandonnee","abandonnees","abandonnement","abandonnements","abandonnent","abandonner","abandonnera","abandonnerai","abandonneraient","abandonnerais","abandonnerait","abandonneras","abandonnerent","abandonnerez","abandonneriez","abandonnerions","abandonnerons","abandonneront","abandonnes","abandonnez","abandonniez","abandonnions","abandonnique","abandonniques"];
        let leftLimit = 0;
        let rightLimit = dictionaryArray.length - 1;

        while (leftLimit <= rightLimit) {
            let middleLimit = leftLimit + Math.floor((rightLimit - leftLimit) / 2);
            
            //localeCompare helps us know if the word is before(-1), equivalent(0) or after(1)
            let comparisonResult = word.localeCompare(dictionaryArray[middleLimit]);
                
            if (comparisonResult < 0)
                rightLimit = middleLimit - 1;

            if (comparisonResult > 0)
                leftLimit = middleLimit + 1;

            else
                return true;
        }
        return false;
    }
}