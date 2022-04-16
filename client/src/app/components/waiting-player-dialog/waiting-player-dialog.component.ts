import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { BotType } from '../../../../../common/botType';
import { CreateSoloRoomInformations } from '../../../../../common/types';

@Component({
    selector: 'app-waiting-player-dialog',
    templateUrl: './waiting-player-dialog.component.html',
    styleUrls: ['./waiting-player-dialog.component.scss'],
})
export class WaitingPlayerDialogComponent {
    constructor(
        private multiplayerDialog: MatDialog,
        public clientSocketHandler: ClientSocketHandler,
        @Inject(MAT_DIALOG_DATA) public data: string,
    ) {}

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
        let modeLog = false;
        if (this.data === 'mode2990') modeLog = true;
        const informations: CreateSoloRoomInformations = {
            username: '',
            socketId: '',
            room: '',
            timer: '',
            modeLog,
            botType: BotType.NoType,
            botName: '',
        };
        this.clientSocketHandler.convertToSoloGame(informations);
        this.multiplayerDialog.closeAll();
    }
}
