import { AfterViewInit, Component } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-tile-holder',
    templateUrl: './tile-holder.component.html',
    styleUrls: ['./tile-holder.component.scss'],
})
export class TileHolderComponent implements AfterViewInit {
    constructor(public chatService: ChatService) {}
    ngAfterViewInit(): void {}
}
