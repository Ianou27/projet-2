import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-best-score',
    templateUrl: './best-score.component.html',
    styleUrls: ['./best-score.component.scss'],
})
export class BestScoreComponent implements OnInit {
    tiles = [
        { text: 'Meilleur Scores', cols: 4, rows: 1, color: 'lightblue' },
        { text: 'Scrabble classique', cols: 2, rows: 1, color: 'lightgray' },
        { text: 'LOG2990', cols: 2, rows: 1, color: '#DDBDF1' },
        { text: 'Scores', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'Joueurs', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'Scores', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'Joueurs', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '14', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'Jack', cols: 1, rows: 1, color: 'lightgray' },
        { text: '12', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'Bill', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '11', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'Dan', cols: 1, rows: 1, color: 'lightgray' },
        { text: '10', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'Anton', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '9', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'Boul', cols: 1, rows: 1, color: 'lightgray' },
        { text: '9', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '6ix9ne', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '9', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'popsimoké', cols: 1, rows: 1, color: 'lightgray' },
        { text: '8', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'nono', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: '8', cols: 1, rows: 1, color: 'lightgray' },
        { text: 'fu', cols: 1, rows: 1, color: 'lightgray' },
        { text: '7', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'Bobépine', cols: 1, rows: 1, color: '#DDBDF1' },
    ];
    constructor(public waitDialog: MatDialog) {}

    ngOnInit(): void {}

    // displayedColumns = ['score', 'name', 'weight', 'name2'];
    // dataSource = ELEMENT_DATA;
    goHome() {
        this.waitDialog.closeAll();
    }
}

// export interface Element {
//     name1: string;
//     score1: number;
//     name2: string;
//     score2: number;
// }

// const ELEMENT_DATA: Element[] = [
//     { score1: 1, name1: 'Hydrogen'},
//     { score1: 2, name1: 'Helium'},
//     { score1: 3, name1: 'Lithium'},
//     { score1: 4, name1: 'Beryllium'},
//     { score1: 5, name1: 'Boron'},
//     { score2: 6, name2: 'Carbon'},
//     { score2: 7, name2: 'Nitrogen'},
//     { score2: 8, name2: 'Oxygen'},
//     { score2: 9, name2: 'Boron'},
//     { score2: 10, name2: 'Boron'},
// ];
