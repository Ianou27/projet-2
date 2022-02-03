import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-communication-area',
    templateUrl: './communication-area.component.html',
    styleUrls: ['./communication-area.component.scss'],
})
export class CommunicationAreaComponent implements OnInit {
    constructor(public chatService: ChatService) {}

    ngOnInit(): void {
        this.chatService.ngOnInit();
    }
}
