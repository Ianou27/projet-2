import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DownloadDialogComponent } from '@app/components/download-dialog/download-dialog.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { ONE_SECOND_MS } from './../../../../../common/constants/general-constants';
import { Dictionary, VirtualPlayer } from './../../../../../common/types';
import { MyErrorStateMatcher } from './../../classes/my-error-state-matcher/my-error-state-matcher';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    showCard: boolean = false;
    virtualPlayer: string = 'Débutants';
    virtualPlayerName: string = '';
    displayedColumns: string[] = ['date', 'duration', 'player1', 'player1Points', 'player2', 'player2Points', 'gameMode'];
    displayedNames: string[] = [];
    displayedFixedNames: string[] = [];
    selectedFile: string = '';
    newName: string = '';
    defaultBeginnerNames: VirtualPlayer[] = [];
    addedBeginnerNames: VirtualPlayer[] = [];
    defaultExpertNames: VirtualPlayer[] = [];
    addedExpertNames: VirtualPlayer[] = [];
    resetSelected: string = 'all';
    titleValue: string = 'default dictionary';
    descriptionValue: string = 'Description de base';
    formModify: FormGroup;
    formAdd: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    matcher = new MyErrorStateMatcher();
    error: string = '';

    constructor(public socketHandler: ClientSocketHandler, public snackBar: MatSnackBar, public dialog: MatDialog) {
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

    myErrorModify(controlName: string, errorName: string): boolean {
        return this.formModify.controls[controlName].hasError(errorName);
    }

    myErrorAdd(controlName: string, errorName: string): boolean {
        return this.formAdd.controls[controlName].hasError(errorName);
    }

    onTabChange(event: MatTabChangeEvent) {
        if (event.tab.textLabel === 'Joueurs virtuels') {
            this.initialNameDisplay();
        } else {
            this.showCard = false;
        }
    }

    download() {
        this.dialog.open(DownloadDialogComponent, {
            disableClose: true,
            height: '250px',
            width: '400px',
        });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    modifyDict(oldTitle: string, title: string, description: string): boolean {
        const dictionaryList: Dictionary[] = this.socketHandler.dictInfoList;

        for (const dict of dictionaryList) {
            if (dict.title !== oldTitle && dict.title === title) {
                this.error = 'Le titre du dictionnaire existe déjà';
                return false;
            }
        }
        if (
            title.replace(/\s/g, '').length === 0 ||
            description.replace(/\s/g, '').length === 0 ||
            (description === this.displayDictDescription(oldTitle)[0] && oldTitle === title)
        ) {
            this.error = 'Veuillez au moins changer une valeur et ne pas laisser de valeur vide';
            return false;
        }
        this.socketHandler.modifyDictionary(oldTitle, title, description);
        this.reloadPage();
        return true;
    }

    deleteDict(title: string) {
        this.socketHandler.deleteDic(title);
        this.reloadPage();
    }

    reloadPage() {
        window.location.reload();
    }

    downloadDict(title: string) {
        this.socketHandler.downloadDictionary(title);
    }
    // https://stackoverflow.com/questions/42360665/angular2-to-export-download-json-file

    addNewPlayer() {
        if (this.virtualPlayer === 'Débutants') {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'beginner');
        } else {
            this.socketHandler.addVirtualPlayerNames(this.virtualPlayerName, 'expert');
        }
        this.virtualPlayerName = '';
        this.refreshDisplayedData();
    }

    deletePlayerName(selectedName: string) {
        this.socketHandler.deleteVirtualPlayerName(selectedName);
        this.refreshDisplayedData();
        this.openSnackBar('Nom supprimé', 'OK!');
    }

    modifyPlayerName(oldName: string) {
        this.socketHandler.modifyVirtualPlayerNames(oldName, this.newName);
        this.refreshDisplayedData();
        this.openSnackBar('Nom modifié', 'OK!');
    }

    initialNameDisplay() {
        this.emptyArray();
        this.setArrays();
        this.setDisplayedNames();
    }

    displayDictNames(): string[] {
        const names: string[] = [];
        const dictionaryList = this.socketHandler.dictInfoList;
        dictionaryList.forEach((dict: Dictionary) => names.push(dict.title));
        return names;
    }

    displayDictDescription(name: string): string[] {
        const descriptions: string[] = [];
        const dictionaryList = this.socketHandler.dictInfoList;
        dictionaryList.forEach((dict: Dictionary) => {
            if (dict.title === name) descriptions.push(dict.description);
        });
        return descriptions;
    }

    onFileSelect(event: Event) {
        this.error = '';
        const target = event.target as HTMLInputElement;
        const file = (target.files as FileList)[0];
        const reader = new FileReader();

        reader.onload = () => {
            this.selectedFile = reader.result as string;
        };
        reader.readAsText(file);
    }

    verifyDict(dict: string): boolean {
        const dictObject = JSON.parse(dict);
        const dictInfoList = this.socketHandler.dictInfoList;
        const dictInfoListFiltered = dictInfoList.filter((dictInfo: Dictionary) => dictInfo.title === dictObject.title);
        const dictWordsValidated =
            typeof dictObject.title === 'string' &&
            dictObject.title !== '' &&
            typeof dictObject.description === 'string' &&
            dictObject.description !== '' &&
            Array.isArray(dictObject.words) &&
            dictObject.words.length !== 0 &&
            dictObject.words.every((word: string) => typeof word === 'string' && word !== '' && word.match(/^[a-zA-Z]+$/));

        if (dictInfoListFiltered.length !== 0) {
            this.error = 'Ce dictionnaire existe déjà';
            return false;
        } else if (dictWordsValidated) {
            return true;
        }
        this.error = 'FORMAT INVALIDE\n Il faut un titre, une description, un tableau de mots valide sans espace';
        return false;
    }

    submit() {
        try {
            const object: Dictionary = JSON.parse(this.selectedFile.toString());
            if (this.verifyDict(this.selectedFile)) {
                this.socketHandler.uploadDictionary(object);

                this.openSnackBar('Dictionnaire ajouté', 'Ok');
            }
        } catch (error) {
            this.error = "Le fichier n'est pas au bon format";
        }
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
                this.socketHandler.resetBestScores();
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
