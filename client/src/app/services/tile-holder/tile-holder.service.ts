import { Injectable } from '@angular/core';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { Tile } from './../../../../../common/tile/Tile';

@Injectable({
    providedIn: 'root',
})
export class TileHolderService {
    tileHolder: Tile[];
    constructor() {
        this.tileHolder = new Array(7);
        for (let i = 0; i < 7; i++) {
            this.tileHolder[i] = new Tile(CaseProperty.Normal, 0, i);
        }
    }
}
