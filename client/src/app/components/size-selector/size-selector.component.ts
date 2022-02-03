import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResizerService } from '@app/services/resizer.service';

@Component({
    selector: 'app-size-selector',
    templateUrl: './size-selector.component.html',
    styleUrls: ['./size-selector.component.scss'],
})
export class SizeSelectorComponent implements OnInit, OnDestroy {
    letterFontSize: number;
    valueFontSize: number;
    constructor(private resizer: ResizerService) {}
    ngOnInit(): void {
        this.resizer.letterFontSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
        this.resizer.valueFontSize.subscribe((valueFontSize) => (this.valueFontSize = valueFontSize));
    }

    changeFont(operator: string) {
        this.resizer.changeFont(operator);
    }

    ngOnDestroy(): void {
        this.resizer.letterFontSize.unsubscribe();
        this.resizer.valueFontSize.unsubscribe();
    }
}
