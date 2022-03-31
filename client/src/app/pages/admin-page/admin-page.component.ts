/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    showCard: boolean = false;
    virtualPlayer: string = 'Débutants';
    virtualPlayerName = '';
    virtualPlayerType = '';
    displayedColumns: string[] = ['date', 'duration', 'player1', 'player1Points', 'player2', 'player2Points', 'gameMode'];
    displayedNames: string[] = ['Ian', 'David'];
    displayedFixedNames: string[] = [];
    selectedFile: File;

    constructor(public socketHandler: ClientSocketHandler) {
        socketHandler.connect();
        socketHandler.getDictionaryInfo();
        socketHandler.getVirtualPlayerNames();
        socketHandler.getHistory();
    }

    onTabChange(event: MatTabChangeEvent) {
        const tab = event.tab.textLabel;
        if (tab === 'Joueurs virtuels') {
            this.initialNameDisplay();
        }
    }

    addNewPlayer() {
        if (this.virtualPlayerType === 'Débutant') {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'beginner');
        } else {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'expert');
        }
        this.virtualPlayerName = '';
        this.virtualPlayerType = '';
    }

    initialNameDisplay() {
        this.emptyArray();
        const beginnerNames = this.socketHandler.virtualPlayerNameList.filter((virtualPlayer) => virtualPlayer.type === 'beginner');
        const defaultBeginnerNames = beginnerNames.filter(
            (virtualPlayer) => virtualPlayer.name === 'Felix' || virtualPlayer.name === 'Richard' || virtualPlayer.name === 'Riad',
        );
        defaultBeginnerNames.forEach((name) => this.displayedFixedNames.push(name.name));
    }

    displayDictNames() {
        const dictionaries: string[] = [];
        const dictionaryList = this.socketHandler.dictInfoList;
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
        const beginnerNames = this.socketHandler.virtualPlayerNameList.filter((virtualPlayer) => virtualPlayer.type === 'beginner');
        const defaultBeginnerNames = beginnerNames.filter(
            (virtualPlayer) => virtualPlayer.name === 'Felix' || virtualPlayer.name === 'Richard' || virtualPlayer.name === 'Riad',
        );
        const expertNames = this.socketHandler.virtualPlayerNameList.filter((virtualPlayer) => virtualPlayer.type === 'expert');
        const defaultExpertNames = expertNames.filter(
            (virtualPlayer) => virtualPlayer.name === 'Ian' || virtualPlayer.name === 'David' || virtualPlayer.name === 'Nicolas',
        );
        this.emptyArray();
        if (this.virtualPlayer === 'Débutants') {
            this.virtualPlayer = 'Experts';
            defaultExpertNames.forEach((name) => this.displayedFixedNames.push(name.name));
        } else {
            this.virtualPlayer = 'Débutants';
            defaultBeginnerNames.forEach((name) => this.displayedFixedNames.push(name.name));
        }
    }

    emptyArray() {
        while (this.displayedFixedNames.length > 0) {
            this.displayedFixedNames.pop();
        }
    }
}
