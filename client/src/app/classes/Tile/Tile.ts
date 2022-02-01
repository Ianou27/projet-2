
export class Tile{
    private letter:Object;
    private position:Array<Number>;
    private specialProperty:caseProperty;

    constructor(position:Array<Number>, specialProperty:caseProperty){
        this.position = position;
        this.specialProperty = specialProperty;
    }

    
}
