import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
    selector: 'app-best-score',
    templateUrl: './best-score.component.html',
    styleUrls: ['./best-score.component.scss'],
})
export class BestScoreComponent {
    displayedColumns = ['score', 'name'];

    constructor(public waitDialog: MatDialog, public chatService: ChatService) {
        this.chatService.connect();
        this.chatService.getScores();
    }

    goHome() {
        this.waitDialog.closeAll();
        this.chatService.disconnect();
    }
}
