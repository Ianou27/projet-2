import { AfterViewChecked, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BestScoreComponent } from '@app/pages/best-score/best-score.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements AfterViewChecked {
    animal: string;
    name: string;

    constructor(public dialog: MatDialog) {}

    ngAfterViewChecked(): void {
        const title = document.getElementsByClassName('rectangle')[0];
        if (title) {
            for (let i = 0; i < title.childElementCount; i++) {
                title.children[i].children[0].classList.replace('tile', 'tileTitle');
                title.children[i].children[0].children[0].id = 'letterTitle';
                const letter = title.children[i].children[0].children[0] as HTMLElement;
                letter.style.fontSize = '40px';
                const score = title.children[i].children[0].children[1] as HTMLElement;
                score.style.fontSize = '20px';
                /* title.children[i].children[0].children[0].classList.add('letter');
                title.children[i].children[0].children[1].classList.add('score'); */
            }
        }
    }

    openDialog(): void {
        this.dialog.open(BestScoreComponent, {
            width: '800px',
        });
    }
}
