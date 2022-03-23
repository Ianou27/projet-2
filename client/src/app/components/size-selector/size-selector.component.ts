import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResizerService } from '@app/services/resizer/resizer.service';

@Component({
    selector: 'app-size-selector',
    templateUrl: './size-selector.component.html',
    styleUrls: ['./size-selector.component.scss'],
})
export class SizeSelectorComponent implements OnInit, OnDestroy {
    letterFontSize: number;
    constructor(private resizer: ResizerService) {}
    ngOnInit(): void {
        this.resizer.letterFontSize.subscribe((letterFontSize) => (this.letterFontSize = letterFontSize));
    }

    changeFont(operator: string) {
        this.resizer.changeFont(operator);
    }

    ngOnDestroy(): void {
        this.resizer.letterFontSize.unsubscribe();
    }
}
