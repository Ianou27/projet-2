import { Injectable } from '@angular/core';
import { DEFAULT_LETTER_SIZE, DEFAULT_VALUE_SIZE, MAX_LETTER_SIZE, MIN_LETTER_SIZE } from '@app/constants/tile-information';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizerService {
    startLetterSize = DEFAULT_LETTER_SIZE;
    startValueSize = DEFAULT_VALUE_SIZE;
    letterFontSize = new BehaviorSubject<number>(this.startLetterSize);
    valueFontSize = new BehaviorSubject<number>(this.startValueSize);
    currentLetterSize = this.letterFontSize.asObservable();
    currentValueSize = this.valueFontSize.asObservable();
    changeFont(operator: string) {
        if (operator === '+' && this.startLetterSize < MAX_LETTER_SIZE) {
            this.changeValue(this.startLetterSize++, this.startValueSize++);
        } else if (operator === '-' && this.startLetterSize > MIN_LETTER_SIZE) {
            this.changeValue(this.startLetterSize--, this.startValueSize--);
        }
    }
    changeValue(letterSize: number, valueSize: number) {
        this.letterFontSize.next(letterSize);
        this.valueFontSize.next(valueSize);
    }
}
