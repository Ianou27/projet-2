import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-waiting-player-dialog',
    templateUrl: './waiting-player-dialog.component.html',
    styleUrls: ['./waiting-player-dialog.component.scss'],
})
export class WaitingPlayerDialogComponent {
    constructor(private multiplayerDialog: MatDialog, public chatService: ChatService) {}

    goBack() {
        this.multiplayerDialog.open(JoinPageComponent, {
            disableClose: true,
        });

        this.chatService.cancelCreation();
      
    }

    accept() {
        this.multiplayerDialog.closeAll();
        this.chatService.accepted();
    }

    deny() {
        this.chatService.playerJoined = false;
        this.chatService.refused();
    }
}
