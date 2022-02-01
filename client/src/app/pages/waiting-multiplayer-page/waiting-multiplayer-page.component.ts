import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingScreenService } from '@app/services/loading-screen/loading-screen.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const debounce = 200;

@Component({
    selector: 'app-waiting-multiplayer-page',
    templateUrl: './waiting-multiplayer-page.component.html',
    styleUrls: ['./waiting-multiplayer-page.component.scss'],
})
export class WaitingMultiplayerPageComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    loadingSubscription: Subscription;
    constructor(private loadingScreenService: LoadingScreenService) {}

    ngOnInit(): void {
        this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(debounce)).subscribe((value) => {
            this.loading = value;
        });
    }
    ngOnDestroy(): void {
        this.loadingSubscription.unsubscribe();
    }
}
