import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-waiting-player-dialog',
    templateUrl: './waiting-player-dialog.component.html',
    styleUrls: ['./waiting-player-dialog.component.scss'],
})
export class WaitingPlayerDialogComponent {
    constructor(private multiplayerDialog: MatDialog, public clientSocketHandler: ClientSocketHandler) {}

    goBack() {
        this.multiplayerDialog.open(JoinPageComponent, {
            disableClose: true,
        });

        this.clientSocketHandler.cancelCreation();
    }

    accept() {
        this.multiplayerDialog.closeAll();
        this.clientSocketHandler.accepted();
    }

    deny() {
        this.clientSocketHandler.playerJoined = false;
        this.clientSocketHandler.refused();
    }

    convertToSolo() {
        this.clientSocketHandler.convertToSoloGame();
        this.multiplayerDialog.closeAll();
    }
}
