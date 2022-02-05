import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-text-history',
    templateUrl: './text-history.component.html',
    styleUrls: ['./text-history.component.scss'],
})
export class TextHistoryComponent implements OnInit {
    history: string[] = [];

    addMessage(message: string) {
        this.history.push(message);
    }
    constructor() {}

    ngOnInit(): void {}
}
