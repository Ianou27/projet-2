import { caseProperty } from '@app/../assets/caseProperty';
import { Tile } from '@app/classes/Tile/Tile';

/* declare var require: any;
const fs = require('fs'); */

export class GameBoardService{
    private lettersReserve:Object;
    public cases:Tile[][] = new Array(15);
    constructor(){
        for (let i = 0; i < 15; i++){
            this.cases[i] = new Array(15);
            for (let j = 0; j < 15; j++){
                let array = [0, 0];
                if((i == 0 && j == 0) || (i == 0 && j == 7) || (i == 0 && j == 14) || (i == 7 && j == 0) ||
                (i == 7 && j == 14) || (i == 14 && j == 0)|| (i == 14 && j == 7) || (i == 14 && j == 14))
                {
                    this.cases[i][j] = new Tile(array, caseProperty.wordTriple);
                }

                else if((i == 1 && j == 1) || (i == 2 && j == 2) || (i == 3 && j == 3) || (i == 4 && j == 4) ||
                        (i == 7 && j == 7)|| (i == 10 && j == 10) || (i == 11 && j == 11) || (i == 12 && j == 12) || (i == 13 && j == 13) ||
                        (i == 1 && j == 13) || (i == 2 && j == 12) || (i == 3 && j == 11) || (i == 4 && j == 10) ||
                        (i == 10 && j == 4) || (i == 11 && j == 3) || (i == 12 && j == 2) || (i == 13 && j == 1))
                {
                    this.cases[i][j] = new Tile(array, caseProperty.wordDouble);
                }

                else if((i == 5 && j == 1) || (i == 9 && j == 1) || (i == 1 && j == 5) || (i == 5 && j == 5) ||
                        (i == 9 && j == 5)|| (i == 13 && j == 5) || (i == 1 && j == 9) || (i == 5 && j == 9) ||
                        (i == 9 && j == 9) || (i == 13 && j == 9) || (i == 5 && j == 13) || (i == 9 && j == 13))
                {
                    this.cases[i][j] = new Tile(array, caseProperty.letterTriple);
                }

                else if ((i == 3 && j == 0) || (i == 11 && j == 0) || (i == 6 && j == 2) || (i == 7 && j == 3) ||
                        (i == 8 && j == 2)|| (i == 0 && j == 3) || (i == 14 && j == 3) || (i == 2 && j == 6) ||
                        (i == 6 && j == 6) || (i == 8 && j == 6) || (i == 12 && j == 6) || (i == 3 && j == 7) ||
                        (i == 11 && j == 7) || (i == 2 && j == 7) || (i == 6 && j == 8) || (i == 8 && j == 8) ||
                        (i == 12 && j == 8)|| (i == 0 && j == 11) || (i == 7 && j == 11) || (i == 14 && j == 11) ||
                        (i == 6 && j == 12) || (i == 8 && j == 12) || (i == 3 && j == 14) || (i == 11 && j == 14))
                {
                    this.cases[i][j] = new Tile(array, caseProperty.letterDouble);
                }

                else{
                    this.cases[i][j] = new Tile(array, caseProperty.normal);
                }
                
            }
        }
        /* this.lettersReserve = JSON.parse(fs.readFileSync("./src/assets/reserveLetters.json")); */
    }

    tileContainsLetter(position:Array<number>) : boolean{
        return this.cases[position[0]][position[1]].tileContainsLetter();
    }

    addLetterTile(position:Array<number>, letter:string) : void {
        this.cases[position[0]][position[1]].addLetter(letter);
    }

    getLetterReserve() : Object {
        return this.lettersReserve;
    }
}
