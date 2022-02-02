import { GameBoardService } from '@app/../../client/src/app/classes/gameBoardService/gameBoardService';
import { PlayerService } from '@app/../../client/src/app/classes/playerService/playerService';

declare var require: any;
const fs = require('fs');

export class GameService  {
    private player1:PlayerService;
    private player2:PlayerService;
    /* private dictionary: string; */
    private gameBoard:GameBoardService;


    constructor(){
        /* this.dictionary = "Mon dictionnaire"; */
        this.gameBoard = new GameBoardService();
        this.player1 = new PlayerService(this.randomShuffleLetters(), true);
        this.player2 = new PlayerService(this.randomShuffleLetters(), true);
        
    }

    changeTurnTwoPlayers(){
        this.player1.changeTurn();
        this.player2.changeTurn();   
    }

    randomShuffleLetters() : Array<string>{
        return [];
    }

    validatedWord(newLettersPositions: Array<{"position" : Array<number>, "letter" : string}>) : boolean {
        for(let letter of newLettersPositions){
            let position = letter.position;
            if(this.gameBoard.tileContainsLetter(position)){
                return false;
            }

            let positionUp = [];
            positionUp[0] = letter.position[0];
            positionUp[1] = letter.position[0] - 1;

            let positionDown = [];
            positionDown[0] = letter.position[0];
            positionDown[1] = letter.position[0] + 1;

            let positionLeft = [];
            positionLeft[0] = letter.position[0] - 1;
            positionLeft[1] = letter.position[0];

            let positionRight = [];
            positionRight[0] = letter.position[0] + 1;
            positionRight[1] = letter.position[0];


        }

        return true;
    }

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
