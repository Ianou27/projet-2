import { AfterViewInit, Component, Input /* , OnInit, DoCheck*/ } from '@angular/core';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements AfterViewInit /* , DoCheck, OnInit*/ /* implements OnDestroy */ {
    @Input() letter: string = '';
    @Input() value: number = 0;
    letterFontSize: number;
    valueFontSize: number;
    constructor() {}
    /*
    ngOnInit(): void {
        this.initialized = true;
    }

    ngDoCheck(): void {
        if (this.initialized) {
            this.letter = this.tile.letter;
            this.value = this.tile.value;
        }
    }*/
    ngAfterViewInit(): void {}
    /*
    ngOnInit(): void {
        this.resizer.letterFontSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
        this.resizer.valueFontSize.subscribe((valueFontSize) => (this.valueFontSize = valueFontSize));
    }

    ngOnDestroy(): void {
        this.resizer.letterFontSize.unsubscribe();
        this.resizer.valueFontSize.unsubscribe();
    }*/
}
