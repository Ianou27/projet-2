import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResizerService {
    startLetterSize = 21;
    startValueSize = 12;
    letterFontSize = new BehaviorSubject<number>(this.startLetterSize);
    valueFontSize = new BehaviorSubject<number>(this.startValueSize);
    currentLetterSize = this.letterFontSize.asObservable();
    currentValueSize = this.valueFontSize.asObservable();
    changeFont(operator: string) {
        if (operator === '+' && this.startLetterSize < 28) {
            this.changeValue(this.startLetterSize++, this.startValueSize++);
        } else if (operator === '-' && this.startLetterSize > 18) {
            this.changeValue(this.startLetterSize--, this.startValueSize--);
        }
    }
    changeValue(letterSize: number, valueSize: number) {
        this.letterFontSize.next(letterSize);
        this.valueFontSize.next(valueSize);
    }
}
