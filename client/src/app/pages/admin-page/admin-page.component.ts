import { Component } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    showCard: boolean = false;
    virtualPlayer: string = 'Débutants';
    displayedColumns: string[] = ['date', 'duration', 'player1', 'firstPlayerScore', 'player2', 'secondPlayerScore', 'mode'];
    displayedNames: string[] = ['Ian', 'David'];
    dataSource = [
        {
            date: '26/03/22 16:06',
            duration: '20:00',
            player1: 'Player 1',
            firstPlayerScore: 120,
            player2: 'Player 2',
            secondPlayerScore: 75,
            mode: 'Classique',
        },
    ];
    fixedStarterNames: string[] = ['Richard', 'Riad', 'Félix'];
    fixedExpertNames: string[] = ['Ian', 'David'];
    displayedFixedNames: string[] = this.fixedStarterNames;
    selectedFile: File;

    constructor(public socketHandler: ClientSocketHandler) {
        socketHandler.connect();
        socketHandler.getDictionaries();
    }

    displayDictionaries() {
        const dictionaries: string[] = [];
        const dictionaryList = this.socketHandler.dictList;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dictionaryList.forEach((dict: any) => dictionaries.push(dict.title));
        return dictionaries;
    }

    // utilisation de code ne provenant pas de nous, source :
    // https://fireflysemantics.medium.com/proxying-file-upload-buttons-with-angular-a5a3fc224c38
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFileSelect(event: any) {
        this.selectedFile = event.target.files[0];
        console.log(this.selectedFile.name);
    }

    changeType() {
        if (this.virtualPlayer === 'Débutants') {
            this.virtualPlayer = 'Experts';
            this.displayedFixedNames = this.fixedExpertNames;
        } else {
            this.virtualPlayer = 'Débutants';
            this.displayedFixedNames = this.fixedStarterNames;
        }
    }
}
