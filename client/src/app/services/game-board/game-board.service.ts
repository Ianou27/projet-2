import { Injectable } from '@angular/core';
import { Tile } from './../../classes/tile/tile';

/* declare var require: any;
const fs = require('fs'); */
@Injectable({
    providedIn: 'root',
})
export class GameBoardService {
    cases: Tile[][] = new Array(15);
    constructor() {
        for (let i = 0; i < 15; i++) {
            this.cases[i] = new Array(15);
            for (let j = 0; j < 15; j++) {
                this.cases[i][j] = new Tile('', 0);
            }
        }
    }

    tileContainsLetter(position: number[]): boolean {
        return this.cases[position[0]][position[1]].tileContainsLetter();
    }

    addLetterTile(position: number[]): void {
        this.cases[position[0]][position[1]].letter = 'z';
    }
}
