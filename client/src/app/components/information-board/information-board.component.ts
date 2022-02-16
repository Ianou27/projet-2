import { Component } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-information-board',
    templateUrl: './information-board.component.html',
    styleUrls: ['./information-board.component.scss'],
})
export class InformationBoardComponent {
    constructor(public chatService: ChatService) {}
}
