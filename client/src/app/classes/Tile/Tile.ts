import { caseProperty } from '@app/../assets/caseProperty';

export class Tile{
    private letter:string = '';
    public position:Array<number>;
    private specialProperty:caseProperty;

    constructor(position:Array<number>, specialProperty:caseProperty){
        this.position = position;
        this.specialProperty = specialProperty;
    }

    tileContainsLetter() : boolean {
        if(this.letter != ''){
            return true;
        }
        return false;
    }

    getSpecialProperty() : caseProperty {
        return this.specialProperty;
    }
    
    addLetter(letter:string) : void {
        this.letter = letter;
    }

    getLetter() : string {
        return this.letter;
    }

    getPosition() : Array<number> {
        return this.position;
    }
}
