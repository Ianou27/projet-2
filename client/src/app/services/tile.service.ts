import { Injectable } from '@angular/core';
import { caseProperty } from 'src/assets/caseProperty';

@Injectable({
    providedIn: 'root',
})
export class TileService {
    specialProperty: caseProperty;

    constructor() {}

    /* tileContainsLetter(): boolean {
        if (this.letter !== '') {
            return true;
        }
        return false;
    }

    addLetter(letter: string): void {
        this.letter = letter;
        this.value = 2;
    }*/
}
