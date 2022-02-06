import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WaitingDialogComponent } from '@app/components/waiting-dialog/waiting-dialog.component';
// import { ScrabbleClassicPageComponent } from '../scrabble-classic-page/scrabble-classic-page.component';

// const debounce = 200;

@Component({
    selector: 'app-waiting-multiplayer-page',
    templateUrl: './waiting-multiplayer-page.component.html',
    styleUrls: ['./waiting-multiplayer-page.component.scss'],
})
export class WaitingMultiplayerPageComponent {
    //     loadingSubscription: Subscription;
    constructor(public dialog: MatDialog) {}
    openDialog() {
        this.dialog.open(WaitingDialogComponent, {
            disableClose: true,
            height: '20%',
            width: '30%',
        });
    }
    //     ngOnInit(): void {
    //         //         this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(debounce)).subscribe((value) => {
    //         //             this.loading = value;
    //         //         });
    //     }
    //     ngOnDestroy(): void {
    //         //         this.loadingSubscription.unsubscribe();
    //     }
}
