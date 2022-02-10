import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ChatService } from '@app/services/chat.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-waiting-player-two',
    templateUrl: './waiting-player-two.component.html',
    styleUrls: ['./waiting-player-two.component.scss'],
})
export class WaitingPlayerTwoComponent implements OnInit {
    constructor(private multiplayerDialog: MatDialog, public chatService: ChatService) {}
    // eslint-disable-next-line @typescript-eslint/member-ordering
    subject = new Subject<string>();

    ngOnInit(): void {}

    join() {
        this.multiplayerDialog.closeAll();
        this.chatService.joinRoom();
        this.chatService.gotAccepted = false;
    }
    refused() {
        setTimeout(() => {
            this.multiplayerDialog.open(JoinPageComponent, {
                disableClose: true,
            });
            this.chatService.gotRefused = false;
        }, 2000);
    }
}
