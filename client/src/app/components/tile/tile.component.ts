import { Component } from '@angular/core';
import { Tile } from '@app/classes/tile';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
    tile: Tile = { letter: 'e', value: 10 };
}
