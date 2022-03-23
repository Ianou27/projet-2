import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';
import { LETTERS_GRID, NUMBERS_GRID } from '@app/constants/general-constants';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    letters: string[];
    numbers: number[];

    constructor(public dialog: MatDialog, private location: LocationStrategy, public clientSocketHandler: ClientSocketHandler) {
        history.pushState(null, '', window.location.href);
        this.location.onPopState(() => {
            history.pushState(null, '', window.location.href);
            this.openDialog();
        });
        this.letters = LETTERS_GRID;
        this.numbers = NUMBERS_GRID;
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
