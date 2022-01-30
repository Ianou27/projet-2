import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    /* defaultTime = 60;
    counter = new BehaviorSubject<number>(this.defaultTime);
    currentTime = this.counter.asObservable(); */

    getCounter(tick: number) {
        return interval(tick);
    }
    /* 
    countdown(time: number) {
        if (time > 0) {
            this.counter.next(this.defaultTime--);
        }
    } */
}
