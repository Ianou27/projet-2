import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CLOSING_DELAY } from '@app/constants/general-constants';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
    selector: 'app-waiting-player-two',
    templateUrl: './waiting-player-two.component.html',
    styleUrls: ['./waiting-player-two.component.scss'],
})
export class WaitingPlayerTwoComponent {
    isBeingRedirected: boolean = false;
    constructor(private multiplayerDialog: MatDialog, public chatService: ChatService) {}

    join() {
        this.multiplayerDialog.closeAll();
        this.chatService.joinRoom();
        this.chatService.gotAccepted = false;
    }
    refused() {
        this.chatService.gotRefused = false;
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
