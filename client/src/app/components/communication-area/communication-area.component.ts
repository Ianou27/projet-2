import { Component, OnInit } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { INDEX_OF_NOT_FOUND } from './../../../../../common/constants/general-constants';

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

    subdivisionCommand(beforeFor: boolean, message: string): string {
        if (message.indexOf('pour') === INDEX_OF_NOT_FOUND && beforeFor) return message;
        else if (beforeFor) return message.substring(0, message.indexOf('pour'));
        return message.substring(message.indexOf('pour'));
    }
}
