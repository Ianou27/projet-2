import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-best-score',
    templateUrl: './best-score.component.html',
    styleUrls: ['./best-score.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BestScoreComponent {
    // tiles = [
    //     { text: 'Meilleur Scores', cols: 4, rows: 1, color: 'lightblue' },
    //     { text: 'Scrabble classique', cols: 2, rows: 1, color: 'lightgray' },
    //     { text: 'LOG2990', cols: 2, rows: 1, color: '#DDBDF1' },
    //     { text: 'Scores', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'Joueurs', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'Scores', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: 'Joueurs', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '14', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'Jack', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: '12', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: 'Bill', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '11', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'Dan', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: '10', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: 'Anton', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '9', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'Boul', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: '9', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '6ix9ne', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '9', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'popsimoké', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: '8', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: 'nono', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: '8', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: 'fu', cols: 1, rows: 1, color: 'lightgray' },
    //     { text: '7', cols: 1, rows: 1, color: '#DDBDF1' },
    //     { text: 'Bobépine', cols: 1, rows: 1, color: '#DDBDF1' },
    // ];
    displayedColumns = ['score', 'name'];
    dataSource = ELEMENT_DATA;
    constructor(public waitDialog: MatDialog) {}

    goHome() {
        this.waitDialog.closeAll();
    }
}

export interface Element {
    name: string;
    score: number;
}

const ELEMENT_DATA: Element[] = [
    { score: 20, name: 'Bob' },
    { score: 18, name: 'Ben' },
    { score: 16, name: 'Bill' },
    { score: 14, name: 'Bary' },
    { score: 12, name: 'Berth' },
];
