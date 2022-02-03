import { Injectable } from '@angular/core';
import { DEFAULT_LETTER_SIZE, MAX_LETTER_SIZE, MIN_LETTER_SIZE } from '@app/constants/tile-information';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizerService {
    startLetterSize = DEFAULT_LETTER_SIZE;
    letterFontSize = new BehaviorSubject<number>(this.startLetterSize);
    changeFont(operator: string) {
        if (operator === '+' && this.letterFontSize.value < MAX_LETTER_SIZE) {
            this.changeValue(this.letterFontSize.value + 1);
        } else if (operator === '-' && this.letterFontSize.value > MIN_LETTER_SIZE) {
            this.changeValue(this.letterFontSize.value - 1);
        }
    }
    changeValue(letterSize: number) {
        this.letterFontSize.next(letterSize);
    }
}
