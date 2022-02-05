import { Component } from '@angular/core';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent /* implements OnInit, OnDestroy */ {
    letter: string = '';
    value: number = 0;
    bonus: string = '';
    positionX: string;
    positionY: string;
    letterFontSize: number;
    valueFontSize: number;
    /* constructor(private resizer: ResizerService) {}

    ngOnInit(): void {
        this.resizer.letterFontSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
        this.resizer.valueFontSize.subscribe((valueFontSize) => (this.valueFontSize = valueFontSize));
    }

    ngOnDestroy(): void {
        this.resizer.letterFontSize.unsubscribe();
        this.resizer.valueFontSize.unsubscribe();
    }*/
}
