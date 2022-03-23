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
}
