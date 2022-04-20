import { Injectable } from '@angular/core';
import { DEFAULT_LETTER_SIZE, MAX_LETTER_SIZE, MIN_LETTER_SIZE } from '@app/../../../common/constants/tile-information';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizerService {
    letterFontSize = new BehaviorSubject<number>(DEFAULT_LETTER_SIZE);

    changeFont(operator: string) {
        if (operator === '+' && this.letterFontSize.value < MAX_LETTER_SIZE) {
            this.changeLetterSizeValue(this.letterFontSize.value + 1);
        } else if (operator === '-' && this.letterFontSize.value > MIN_LETTER_SIZE) {
            this.changeLetterSizeValue(this.letterFontSize.value - 1);
        }
    }
    changeLetterSizeValue(letterSize: number) {
        this.letterFontSize.next(letterSize);
    }
}
