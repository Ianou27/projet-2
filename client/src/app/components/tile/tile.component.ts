import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
    @Input() letter: string = '';
    @Input() value: number = 0;
    letterFontSize: number;
    valueFontSize: number;

    tileStyle: string = 'tile';
    select() {
        if (this.tileStyle === 'selected') {
            this.tileStyle = 'tile';
        } else {
            this.tileStyle = 'selected';
        }
    }
}
