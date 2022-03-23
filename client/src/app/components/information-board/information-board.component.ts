import { Component } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-information-board',
    templateUrl: './information-board.component.html',
    styleUrls: ['./information-board.component.scss'],
})
export class InformationBoardComponent {
    constructor(public clientSocketHandler: ClientSocketHandler) {}
}
