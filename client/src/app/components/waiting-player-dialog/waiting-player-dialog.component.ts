import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';

@Component({
    selector: 'app-waiting-player-dialog',
    templateUrl: './waiting-player-dialog.component.html',
    styleUrls: ['./waiting-player-dialog.component.scss'],
})
export class WaitingPlayerDialogComponent implements OnInit {
    constructor(private multiplayerDialog: MatDialog) {}

    ngOnInit(): void {}

    goBack() {
        this.multiplayerDialog.open(JoinPageComponent, {
            disableClose: true,
        });
    }
}
