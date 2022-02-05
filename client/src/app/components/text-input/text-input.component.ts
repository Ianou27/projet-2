import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements AfterViewInit {
    text: string = '';
    constructor() {}

    @Output() newTextEvent = new EventEmitter<string>();

    clear() {
        this.text = ' ';
    }
    addNewText(text: string) {
        if (text != ' ') {
            if (text != '') {
                this.newTextEvent.emit(text);
            }
        }
    }

    ngAfterViewInit(): void {}
}
