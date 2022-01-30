import { Component, OnInit } from '@angular/core';
import { TimerService } from '@app/services/timer.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-information-board',
    templateUrl: './information-board.component.html',
    styleUrls: ['./information-board.component.scss'],
})
export class InformationBoardComponent implements OnInit {
    countDown: Subscription;
    counter = 60;
    tick = 1000;

    constructor(private timerService: TimerService) {}

    ngOnInit() {
        this.countDown = this.timerService.getCounter(this.tick).subscribe(() => {
            if (this.counter > 0) {
                this.counter--;
            }
        });
    }
}
