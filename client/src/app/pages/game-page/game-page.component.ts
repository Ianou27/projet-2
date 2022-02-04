import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public dialog: MatDialog) {}
    openDialog() {
        this.dialog.open(QuitGameDialogComponent);
    }
}
