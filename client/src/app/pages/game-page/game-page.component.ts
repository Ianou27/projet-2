import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    constructor(public dialog: MatDialog, private location: LocationStrategy, public chatService:ChatService) {
        history.pushState(null, '', window.location.href);
        this.location.onPopState(() => {
            history.pushState(null, '', window.location.href);
            this.openDialog();
        });
    }

    ngOnInit(): void {
        this.dialog.open(JoinPageComponent, {
            disableClose: true,
        });
    }

    openDialog() {
        this.dialog.open(QuitGameDialogComponent);
    }
}
