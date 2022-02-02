import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerPageComponent } from '@app/pages/multiplayer-page/multiplayer-page.component';

@Component({
    selector: 'app-scrabble-classic-page',
    templateUrl: './scrabble-classic-page.component.html',
    styleUrls: ['./scrabble-classic-page.component.scss'],
})
export class ScrabbleClassicPageComponent {
    name: string;
    time: number;
    options: string[] = ['Dictionnaire par défaut', 'Dictionnaire qui n`est pas la'];

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(MultiplayerPageComponent, {
            height: '600px',
            width: '500px',
            data: { name: this.name, time: this.time, options: this.options },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.options = result;
        });
    }
}
