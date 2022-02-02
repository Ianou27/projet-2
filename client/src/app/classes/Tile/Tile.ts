
export class Tile{
    private letter:Object;
    public position:Array<Number>;
    private specialProperty:caseProperty;

    constructor(position:Array<Number>, specialProperty:caseProperty){
        this.position = position;
        this.specialProperty = specialProperty;
    }

    
}
