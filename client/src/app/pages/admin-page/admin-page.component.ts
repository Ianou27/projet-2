/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { ONE_SECOND_MS } from './../../../../../common/constants/general-constants';
import { Dic } from './../../../../../common/types';
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
    selectedFile: string;
    newName: string = '';
    defaultBeginnerNames: any[] = [];
    addedBeginnerNames: any[] = [];
    defaultExpertNames: any[] = [];
    addedExpertNames: any[] = [];
    resetSelected: string = 'all';
    titleValue: string = '';
    descriptionValue: string = '';
    formModify: FormGroup;
    formAdd: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    matcher = new MyErrorStateMatcher();
    error: string = '';
    downloadJsonHref: any;

    constructor(public socketHandler: ClientSocketHandler, public snackBar: MatSnackBar, private sanitizer: DomSanitizer) {
        socketHandler.connect();
        socketHandler.getAdminPageInfo();
        this.titleValue = 'default dictionary';
        this.descriptionValue = 'Description de base';
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

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    modifyDict(oldTitle: string, title: string, description: string): boolean {
        console.log(title, description);
        const dictionaryList: Dic[] = this.socketHandler.dictInfoList;

        for (let dict of dictionaryList) {
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
        } else {
            this.socketHandler.modifyDictionary(oldTitle, title, description);
            window.location.reload();
        }
        return true;
    }

    deleteDict(title: string) {
        this.socketHandler.deleteDic(title);
        window.location.reload();
    }

    downloadDict(title: string) {
        this.socketHandler.downloadDictionary(title);
        this.generateDownloadJsonUri();
    }
    //https://stackoverflow.com/questions/42360665/angular2-to-export-download-json-file
    generateDownloadJsonUri() {
        var theJSON = (this.socketHandler.dictionaryToDownload).toString();
        console.log(this.socketHandler.dictionaryToDownload);
        var uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
    }
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
        const names: string[] = [];
        const dictionaryList = this.socketHandler.dictInfoList;
        dictionaryList.forEach((dict: Dic) => names.push(dict.title));
        return names;
    }

    displayDictDescription(name: string): string[] {
        const descriptions: string[] = [];
        const dictionaryList = this.socketHandler.dictInfoList;
        dictionaryList.forEach((dict: Dic) => {
            if (dict.title === name) descriptions.push(dict.description);
        });
        return descriptions;
    }

    // utilisation de code ne provenant pas de nous, source :
    // https://fireflysemantics.medium.com/proxying-file-upload-buttons-with-angular-a5a3fc224c38
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
        const dictInfoListFiltered = dictInfoList.filter((dictInfo: Dic) => dictInfo.title === dictObject.title);
        console.log(dictInfoListFiltered.length);
        if (dictInfoListFiltered.length !== 0) {
            this.error = 'Ce dictionnaire existe deja';
            return false;
        } else if (
            typeof dictObject.title === 'string' &&
            dictObject.title !== '' &&
            typeof dictObject.description === 'string' &&
            dictObject.description !== '' &&
            Array.isArray(dictObject.words) &&
            dictObject.words.length !== 0 &&
            dictObject.words.every((word: string) => typeof word === 'string' && word !== '' && word.match(/^[a-zA-Z]+$/))
        ) {
            return true;
        } else {
            this.error =
                ' Le format du dictionnaire n est pas valide\n Il faut un titre, une description, un tableau de mots et que tous les mots dans le tableaux soient dans l alphabet anglais sans espace';
            return false;
        }
    }
    submit() {
        try {
            const object: JSON = JSON.parse(this.selectedFile.toString());

            if (this.verifyDict(this.selectedFile)) {
                this.socketHandler.uploadDictionary(object);

                this.openSnackBar('Dictionnaire ajouté', 'Ok');
                window.location.reload();
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
