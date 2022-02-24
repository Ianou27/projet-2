import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BestScoreComponent } from '@app/pages/best-score/best-score.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    animal: string;
    name: string;

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(BestScoreComponent, {
            width: '1300px',
            height: '855px',
        });
    }
}
