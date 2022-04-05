import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
    modeGame: string;

    constructor(
        public dialog: MatDialog,
        private location: LocationStrategy,
        public clientSocketHandler: ClientSocketHandler,
        private route: ActivatedRoute,
    ) {
        history.pushState(null, '', window.location.href);
        this.location.onPopState(() => {
            history.pushState(null, '', window.location.href);
            this.openDialog();
        });
        this.letters = LETTERS_GRID;
        this.numbers = NUMBERS_GRID;
        this.route.params.subscribe((params) => (this.modeGame = params.mode));
    }

    ngOnInit(): void {
        this.dialog.open(JoinPageComponent, {
            disableClose: true,
            data: this.modeGame,
        });
    }

    openDialog() {
        this.dialog.open(QuitGameDialogComponent);
    }
}
