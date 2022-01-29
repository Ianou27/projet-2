import { Component, OnInit } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { ResizerService } from '@app/services/resizer.service';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
    tile: Tile = { letter: 'e', value: 10 };
    letterFontSize: number;
    valueFontSize: number;
    constructor(private resizer: ResizerService) {}

    ngOnInit(): void {
        this.resizer.currentLetterSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
        this.resizer.currentValueSize.subscribe((valueFontSize) => (this.valueFontSize = valueFontSize));
    }
}
