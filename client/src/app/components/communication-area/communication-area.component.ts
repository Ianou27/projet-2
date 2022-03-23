import { Component, OnInit } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-communication-area',
    templateUrl: './communication-area.component.html',
    styleUrls: ['./communication-area.component.scss'],
})
export class CommunicationAreaComponent implements OnInit {
    constructor(public clientSocketHandler: ClientSocketHandler) {}

    ngOnInit(): void {
        this.clientSocketHandler.init();
    }
}
