import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CLOSING_DELAY } from '@app/constants/general-constants';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-waiting-player-two',
    templateUrl: './waiting-player-two.component.html',
    styleUrls: ['./waiting-player-two.component.scss'],
})
export class WaitingPlayerTwoComponent {
    isBeingRedirected: boolean;
    constructor(private multiplayerDialog: MatDialog, public clientSocketHandler: ClientSocketHandler) {
        this.isBeingRedirected = false;
    }

    join() {
        this.multiplayerDialog.closeAll();
        this.clientSocketHandler.joinRoom();
        this.clientSocketHandler.gotAccepted = false;
    }
    refused() {
        this.clientSocketHandler.gotRefused = false;
        this.isBeingRedirected = true;
        setTimeout(() => {
            this.isBeingRedirected = false;
            this.multiplayerDialog.closeAll();
            this.multiplayerDialog.open(JoinPageComponent, {
                disableClose: true,
            });
        }, CLOSING_DELAY);
    }
}
