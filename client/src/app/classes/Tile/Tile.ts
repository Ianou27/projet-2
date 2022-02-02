
export class Tile{
    private letter:string = '';
    public position:Array<Number>;
    private specialProperty:caseProperty;

    constructor(position:Array<Number>, specialProperty:caseProperty){
        this.position = position;
        this.specialProperty = specialProperty;
    }

    tileContainsLetter() : boolean {
        if(this.letter != ''){
            return true;
        }
        return false;
    }

    getSpecialProperty() : caseProperty{
        return this.specialProperty;
    }
    
    addLetter(letter:string) : void{
        this.letter = letter;
    }

    getLetter() : string{
        return this.letter;
    }
}
