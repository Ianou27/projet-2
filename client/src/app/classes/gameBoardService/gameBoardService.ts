import { caseProperty } from '@app/../assets/caseProperty';
import { Tile } from '@app/classes/Tile/Tile';

/* declare var require: any;
const fs = require('fs'); */

export class GameBoardService{
    private lettersReserve:Object;
    public cases:Tile[][];
    constructor(){
        for (let i = 0; i < 15; i++){
            for (let j = 0; j < 15; j++){
                let array = [i, j];
                if(array == [0,0] || array == [0,7] || array == [0,14] || array == [7,0] ||
                   array == [7,14] || array == [14,0]|| array == [14,7] || array == [14,14])
                {
                    this.cases[i][j] = new Tile(array, caseProperty.wordTriple);
                }

                else if(array == [1,1] || array == [2,2] || array == [3,3] || array == [4,4] ||
                        array == [7,7]|| array == [10,10] || array == [11,11] || array == [12,12] || array == [13,13] ||
                        array == [1,13] || array == [2,12] || array == [3,11] || array == [4,10] ||
                        array == [7,7]|| array == [10,4] || array == [11,3] || array == [12,2] || array == [13,1])
                {
                    this.cases[i][j] = new Tile(array, caseProperty.wordDouble);
                }

                else if(array == [5,1] || array == [9,1] || array == [1,5] || array == [5,5] ||
                        array == [9,5]|| array == [13,5] || array == [1,9] || array == [5,9] ||
                        array == [9,9] || array == [13,9] || array == [5,13] || array == [9,13])
                {
                    this.cases[i][j] = new Tile(array, caseProperty.letterTriple);
                }

                else if (array == [3,0] || array == [11,0] || array == [6,2] || array == [7,3] ||
                    array == [8,2]|| array == [0,3] || array == [14,3] || array == [2,6] ||
                    array == [6,6] || array == [8,6] || array == [12,6] || array == [3,7] ||
                    array == [11,7] || array == [2,8] || array == [6,8] || array == [8,8] ||
                    array == [12,8]|| array == [0,11] || array == [7,11] || array == [14,11] ||
                    array == [6,12] || array == [8,12] || array == [3,14] || array == [11,14])
                {
                    this.cases[i][j] = new Tile(array, caseProperty.letterDouble);
                }

                else{
                    this.cases[i][j] = new Tile(array, caseProperty.normal);
                }
                
            }
        }

/*         this.lettersReserve = JSON.parse(fs.readFileSync("./src/assets/reserveLetters.json")); */
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
