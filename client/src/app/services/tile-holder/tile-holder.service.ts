import { Injectable } from '@angular/core';
import { NUMBER_LETTER_TILEHOLDER } from '@app/constants/general-constants';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { Tile } from './../../../../../common/tile/Tile';

@Injectable({
    providedIn: 'root',
})
export class TileHolderService {
    tileHolder: Tile[];
    constructor() {
        this.tileHolder = new Array(NUMBER_LETTER_TILEHOLDER);
        for (let i = 0; i < NUMBER_LETTER_TILEHOLDER; i++) {
            this.tileHolder[i] = new Tile(CaseProperty.Normal, 0, i);
        }
    }
}
