
export class Tile{
    letter:Object;
    position:Array<Number>;
    specialProperty:caseProperty;

    constructor(letter:Object, position:Array<Number>, specialProperty:caseProperty){
        this.letter = letter;
        this.position = position;
        this.specialProperty = specialProperty; 
    }
}
