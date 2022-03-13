import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-best-score',
    templateUrl: './best-score.component.html',
    styleUrls: ['./best-score.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BestScoreComponent {

    displayedColumns = ['score', 'name'];

    constructor(public waitDialog: MatDialog,  public chatService: ChatService) {
        this.chatService.connect();
        this.chatService.getClassiqueScores();
      
    }

    goHome() {
        this.waitDialog.closeAll();
        this.chatService.disconnect();
    }
}



