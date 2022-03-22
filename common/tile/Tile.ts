import { CaseProperty } from './../assets/case-property';

export class Tile {
    letter: string;
    value: number;
    specialProperty: CaseProperty;
    positionX: number;
    positionY: number;

    constructor(specialProperty: CaseProperty, positionX: number, positionY: number) {
        this.specialProperty = specialProperty;
        this.positionX = positionX;
        this.positionY = positionY;
        this.value = 0;
        this.letter = '';
    }
}
