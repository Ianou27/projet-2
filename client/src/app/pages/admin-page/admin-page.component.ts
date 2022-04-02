/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { ONE_SECOND_MS } from './../../../../../common/constants/general-constants';
import { MyErrorStateMatcher } from './../join-page/errorStateMatcher/error-state-matcher';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    showCard: boolean = false;
    virtualPlayer: string = 'Débutants';
    virtualPlayerName: string = '';
    virtualPlayerType: string = '';
    displayedColumns: string[] = ['date', 'duration', 'player1', 'player1Points', 'player2', 'player2Points', 'gameMode'];
    displayedNames: string[] = [];
    displayedFixedNames: string[] = [];
    selectedFile: File;
    newName: string = '';
    defaultBeginnerNames: any[] = [];
    addedBeginnerNames: any[] = [];
    defaultExpertNames: any[] = [];
    addedExpertNames: any[] = [];
    resetSelected: string = 'all';
    formModify: FormGroup;
    formAdd: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    matcher = new MyErrorStateMatcher();

    constructor(public socketHandler: ClientSocketHandler) {
        socketHandler.connect();
        socketHandler.getAdminPageInfo();
    }

    ngOnInit(): void {
        this.formModify = new FormGroup({
            modifiedName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaNumericRegex)]),
        });
        this.formAdd = new FormGroup({
            newName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaNumericRegex)]),
        });
    }

    myErrorModify = (controlName: string, errorName: string) => {
        // eslint-disable-next-line no-invalid-this
        return this.formModify.controls[controlName].hasError(errorName);
    };

    myErrorAdd = (controlName: string, errorName: string) => {
        // eslint-disable-next-line no-invalid-this
        return this.formAdd.controls[controlName].hasError(errorName);
    };

    onTabChange(event: MatTabChangeEvent) {
        const tab = event.tab.textLabel;
        if (tab === 'Joueurs virtuels') {
            this.initialNameDisplay();
        } else {
            this.showCard = false;
        }
    }

    /* validateName(name: string) {
        const virtualPlayerArray = this.socketHandler.virtualPlayerNameList;
        if (virtualPlayerArray.filter((virtualPlayer) => virtualPlayer.name === name)) {
            console.log('true');
        } else {
            console.log('false');
        }
        return false;
    } */

    addNewPlayer() {
        if (this.virtualPlayerType === 'Débutant') {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'beginner');
        } else {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'expert');
        }
        this.virtualPlayerName = '';
        this.virtualPlayerType = '';
        this.refreshDisplayedData();
    }

    deletePlayerName(selectedName: string) {
        this.socketHandler.deleteVirtualPlayerName(selectedName);
        this.refreshDisplayedData();
    }

    modifyPlayerName(oldName: string) {
        this.socketHandler.modifyVirtualPlayerNames(oldName, this.newName);
        this.refreshDisplayedData();
    }

    initialNameDisplay() {
        this.emptyArray();
        this.setArrays();
        this.setDisplayedNames();
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
        this.setArrays();
        if (this.virtualPlayer === 'Débutants') {
            this.virtualPlayer = 'Experts';
            this.setDisplayedNames();
        } else {
            this.virtualPlayer = 'Débutants';
            this.setDisplayedNames();
        }
    }

    refreshDisplayedData() {
        setTimeout(() => {
            this.setArrays();
            this.setDisplayedNames();
        }, ONE_SECOND_MS);
    }

    setDisplayedNames() {
        this.emptyArray();
        if (this.virtualPlayer === 'Experts') {
            this.defaultExpertNames.forEach((name) => this.displayedFixedNames.push(name.name));
            this.addedExpertNames.forEach((name) => this.displayedNames.push(name.name));
        } else {
            this.defaultBeginnerNames.forEach((name) => this.displayedFixedNames.push(name.name));
            this.addedBeginnerNames.forEach((name) => this.displayedNames.push(name.name));
        }
    }

    setArrays() {
        const beginnerNames = this.socketHandler.virtualPlayerNameList.filter((virtualPlayer) => virtualPlayer.type === 'beginner');
        this.defaultBeginnerNames = beginnerNames.filter(
            (virtualPlayer) => virtualPlayer.name === 'Felix' || virtualPlayer.name === 'Richard' || virtualPlayer.name === 'Riad',
        );
        this.addedBeginnerNames = beginnerNames.filter((virtualPlayer) => !this.defaultBeginnerNames.includes(virtualPlayer));
        const expertNames = this.socketHandler.virtualPlayerNameList.filter((virtualPlayer) => virtualPlayer.type === 'expert');
        this.defaultExpertNames = expertNames.filter(
            (virtualPlayer) => virtualPlayer.name === 'Ian' || virtualPlayer.name === 'David' || virtualPlayer.name === 'Nicolas',
        );
        this.addedExpertNames = expertNames.filter((virtualPlayer) => !this.defaultExpertNames.includes(virtualPlayer));
    }
    reset() {
        switch (this.resetSelected) {
            case 'virtualPlayer': {
                this.socketHandler.resetVirtualPlayers();
                this.refreshDisplayedData();

                break;
            }
            case 'dictionaries': {
                this.socketHandler.resetDictionary();
                this.refreshDisplayedData();

                break;
            }
            case 'history': {
                this.socketHandler.resetGameHistory();
                this.refreshDisplayedData();

                break;
            }
            case 'bestScore': {
                // this.socketHandler.resetGameHistory();
                this.refreshDisplayedData();

                break;
            }
            default: {
                this.socketHandler.resetAll();
                this.refreshDisplayedData();
            }
        }
    }

    emptyArray() {
        while (this.displayedFixedNames.length > 0) {
            this.displayedFixedNames.pop();
        }
        while (this.displayedNames.length > 0) {
            this.displayedNames.pop();
        }
    }
}
