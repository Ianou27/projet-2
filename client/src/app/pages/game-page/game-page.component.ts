import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public dialog: MatDialog, private location: LocationStrategy) {
        history.pushState(null, '', window.location.href);
        this.location.onPopState(() => {
            history.pushState(null, '', window.location.href);
            this.openDialog();
        });
    }
    openDialog() {
        this.dialog.open(QuitGameDialogComponent);
    }
}
