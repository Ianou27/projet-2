import { Component, OnInit } from '@angular/core';
import { ResizerService } from '@app/services/resizer.service';

@Component({
    selector: 'app-size-selector',
    templateUrl: './size-selector.component.html',
    styleUrls: ['./size-selector.component.scss'],
})
export class SizeSelectorComponent implements OnInit {
    letterFontSize: number;
    valueFontSize: number;
    constructor(private resizer: ResizerService) {}
    ngOnInit(): void {
        this.resizer.currentLetterSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
        this.resizer.currentValueSize.subscribe((valueFontSize) => (this.valueFontSize = valueFontSize));
    }

    changeFont(operator: string) {
        this.resizer.changeFont(operator);
    }
}
