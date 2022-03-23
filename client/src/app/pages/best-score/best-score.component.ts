import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-best-score',
    templateUrl: './best-score.component.html',
    styleUrls: ['./best-score.component.scss'],
})
export class BestScoreComponent {
    displayedColumns = ['score', 'name'];

    constructor(public waitDialog: MatDialog, public clientSocketHandler: ClientSocketHandler) {
        this.clientSocketHandler.connect();
        this.clientSocketHandler.getScores();
    }

    goHome() {
        this.waitDialog.closeAll();
        this.clientSocketHandler.disconnect();
    }
}
