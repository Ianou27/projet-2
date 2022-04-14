/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DownloadDialogComponent } from '@app/components/download-dialog/download-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { AdminPageComponent } from './admin-page.component';
import SpyObj = jasmine.SpyObj;

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let clientSocketHandlerSpy: SpyObj<ClientSocketHandler>;
    let windowMock: any;

    beforeEach(() => {
        clientSocketHandlerSpy = jasmine.createSpyObj(
            'ClientSocketHandler',
            [
                'connect',
                'getAdminPageInfo',
                'addVirtualPlayerNames',
                'deleteVirtualPlayerName',
                'modifyVirtualPlayerNames',
                'modifyDictionary',
                'deleteDic',
                'uploadDictionary',
                'downloadDictionary',
                'resetVirtualPlayers',
                'resetDictionary',
                'resetGameHistory',
                'resetBestScores',
                'resetAll',
            ],
            {
                virtualPlayerNameList: [
                    { name: 'Felix', type: 'beginner' },
                    { name: 'Richard', type: 'beginner' },
                    { name: 'Riad', type: 'beginner' },
                    { name: 'Ian', type: 'expert' },
                    { name: 'David', type: 'expert' },
                    { name: 'Nicolas', type: 'expert' },
                    { name: 'Joe', type: 'beginner' },
                    { name: 'Jimmy', type: 'beginner' },
                    { name: 'Melanie', type: 'expert' },
                ],
                dictInfoList: [{ title: 'titre', description: 'description' }],
            },
        );
        windowMock = { location: { reload: jasmine.createSpy('reload') } };
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent, DownloadDialogComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule, MatDialogModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: ClientSocketHandler, useValue: clientSocketHandlerSpy },
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {
                            return;
                        },
                        closeAll: () => {
                            return;
                        },
                    },
                },
                { provide: Window, useValue: windowMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('tab change should call method', () => {
        fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1].nativeElement.click();
        fixture.detectChanges();
    });

    it('tab change should call method', () => {
        fixture.debugElement.queryAll(By.css('.mat-tab-label'))[2].nativeElement.click();
        fixture.detectChanges();
        expect(component.showCard).toBeFalse();
    });

    it('download should call open on the dialog and disable the option to click outside to close', () => {
        const dialogSpy = spyOn(component.dialog, 'open');
        component.download();
        expect(dialogSpy).toHaveBeenCalledWith(DownloadDialogComponent, {
            disableClose: true,
            height: '250px',
            width: '400px',
        });
    });

    it('openSnackBar should call open on the injected snack bar', () => {
        const snackSpy = spyOn(component.snackBar, 'open');
        component.openSnackBar('Allo', 'Bye');
        expect(snackSpy).toHaveBeenCalled();
        expect(snackSpy).toHaveBeenCalledWith('Allo', 'Bye', { duration: 3000 });
    });

    it('modifyDict should return false if given already existant name', () => {
        const returnValue = component.modifyDict('test', 'titre', 'description');
        expect(component.error).toEqual('Le titre du dictionnaire existe déjà');
        expect(returnValue).toBeFalse();
    });

    it('modifyDict should return false if no value changed', () => {
        const returnValue = component.modifyDict('titre', 'titre', 'description');
        expect(component.error).toEqual('Veuillez au moins changer une valeur et ne pas laisser de valeur vide');
        expect(returnValue).toBeFalse();
    });

    it('modifyDict should return false if no value changed', () => {
        component.reloadPage = () => {
            return;
        };
        const reloadSpy = spyOn(component, 'reloadPage');
        const returnValue = component.modifyDict('titre', 'nouveau titre', 'nouvelle description');
        expect(reloadSpy).toHaveBeenCalled();
        expect(returnValue).toBeTrue();
    });

    it('deleteDict should reload page', () => {
        component.reloadPage = () => {
            return;
        };
        const reloadSpy = spyOn(component, 'reloadPage');
        component.deleteDict('titre');
        expect(reloadSpy).toHaveBeenCalled();
    });

    it('reload page should call reload', () => {
        const reloadSpy = spyOn<any>(window.location, 'reload').and.stub();
        component.reloadPage();
        expect(reloadSpy).toHaveBeenCalled();
    });

    it('downloadDict', () => {
        component.downloadDict('titre');
    });

    it('should add a new player', () => {
        component.virtualPlayer = 'Débutants';
        component.virtualPlayerName = 'Player';
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.addNewPlayer();
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('should add a new player', () => {
        component.virtualPlayer = 'Experts';
        component.virtualPlayerName = 'Player';
        fixture.detectChanges();
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.addNewPlayer();
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('should delete player', () => {
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData').and.callThrough();
        component.setArrays();
        component.setDisplayedNames();
        component.deletePlayerName('Joe');
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('should modify player name', () => {
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData').and.callThrough();
        component.setArrays();
        component.setDisplayedNames();
        component.modifyPlayerName('Joe');
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('initialNameDisplay should call other methods', () => {
        const emptySpy = spyOn<any>(component, 'emptyArray');
        const setArraysSpy = spyOn<any>(component, 'setArrays');
        const setDisplayedSpy = spyOn<any>(component, 'setDisplayedNames');
        component.initialNameDisplay();
        expect(emptySpy).toHaveBeenCalled();
        expect(setArraysSpy).toHaveBeenCalled();
        expect(setDisplayedSpy).toHaveBeenCalled();
    });

    it('changeType should set which type of player is displayed and change virtualPlayer value', () => {
        component.virtualPlayer = 'Débutants';
        const setSpy = spyOn<any>(component, 'setDisplayedNames');
        component.changeType();
        expect(setSpy).toHaveBeenCalled();
        expect(component.virtualPlayer).toEqual('Experts');
    });

    it('changeType should set which type of player is displayed and change virtualPlayer value', () => {
        component.virtualPlayer = 'Experts';
        const setSpy = spyOn<any>(component, 'setDisplayedNames');
        component.changeType();
        expect(setSpy).toHaveBeenCalled();
        expect(component.virtualPlayer).toEqual('Débutants');
    });

    it('refreshDisplayedDate should refresh the values in all the names array', (done) => {
        const setArraysSpy = spyOn<any>(component, 'setArrays').and.callThrough();
        const setDisplayedSpy = spyOn<any>(component, 'setDisplayedNames');
        component.refreshDisplayedData();
        setTimeout(() => {
            fixture.detectChanges();
            expect(setArraysSpy).toHaveBeenCalled();
            expect(setDisplayedSpy).toHaveBeenCalled();
            done();
        }, 2000);
    });

    it('setDisplayedNames should set displayed names according to chosen player type', () => {
        const dictionaries = component.displayDictNames();
        expect(dictionaries).toEqual(['titre']);
    });

    it('setDisplayedNames should set displayed names according to chosen player type', () => {
        component.setArrays();
        component.setDisplayedNames();
        expect(component.displayedFixedNames).toEqual(['Felix', 'Richard', 'Riad']);
        expect(component.displayedNames).toEqual(['Joe', 'Jimmy']);
    });

    it('setDisplayedNames should set displayed names according to chosen player type', () => {
        component.virtualPlayer = 'Experts';
        component.setArrays();
        component.setDisplayedNames();
        expect(component.displayedFixedNames).toEqual(['Ian', 'David', 'Nicolas']);
        expect(component.displayedNames).toEqual(['Melanie']);
    });

    it('setArrays should set different values to different arrays', () => {
        component.setArrays();
        expect(component.defaultBeginnerNames).toEqual([
            { name: 'Felix', type: 'beginner' },
            { name: 'Richard', type: 'beginner' },
            { name: 'Riad', type: 'beginner' },
        ]);
        expect(component.addedBeginnerNames).toEqual([
            { name: 'Joe', type: 'beginner' },
            { name: 'Jimmy', type: 'beginner' },
        ]);
        expect(component.defaultExpertNames).toEqual([
            { name: 'Ian', type: 'expert' },
            { name: 'David', type: 'expert' },
            { name: 'Nicolas', type: 'expert' },
        ]);
        expect(component.addedExpertNames).toEqual([{ name: 'Melanie', type: 'expert' }]);
    });

    it('reset should call reset in service', () => {
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.resetSelected = 'virtualPlayer';
        component.reset();
        component.resetSelected = 'dictionaries';
        component.reset();
        component.resetSelected = 'history';
        component.reset();
        component.resetSelected = 'bestScore';
        component.reset();
        component.resetSelected = 'all';
        component.reset();
        expect(refreshSpy).toHaveBeenCalledTimes(5);
    });

    it('emptyArray should empty the arrays displayed', () => {
        component.setArrays();
        component.setDisplayedNames();
        component.emptyArray();
        expect(component.displayedFixedNames).toEqual([]);
        expect(component.displayedNames).toEqual([]);
    });

    // Code pour ce test trouvé sur stack overflow
    // https://stackoverflow.com/questions/55356093/how-to-write-the-unit-testing-for-the-file-upload-method-in-the-angular-7-or-2
    it('should detect file input change and set uploadedFile  model', () => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([''], 'test-file.json'));

        const inputDebugElement = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugElement.nativeElement.files = dataTransfer.files;

        inputDebugElement.nativeElement.dispatchEvent(new InputEvent('change'));

        fixture.detectChanges();

        expect(component.error).toEqual('');
        expect(component.selectedFile).toBeUndefined();
    });

    it('submit should call other methods', () => {
        component.reloadPage = () => {
            return;
        };
        const reloadSpy = spyOn(component, 'reloadPage');
        const snackBarSpy = spyOn(component, 'openSnackBar');
        component.selectedFile = '{"title": "test", "description": "ce dictionnaire est seulement un test  ss", "words":["aa","aalenien"]}';
        component.submit();
        expect(reloadSpy).toHaveBeenCalled();
        expect(snackBarSpy).toHaveBeenCalled();
    });

    it('submit should change error when file is not the correct format', () => {
        component.selectedFile = '';
        component.submit();
        expect(component.error).toEqual("Le fichier n'est pas au bon format");
    });

    it('verifyDict returns false if new dictionnary title is the same as an already existant dictionary', () => {
        component.selectedFile = '{"title": "titre", "description": "ce dictionnaire est seulement un test", "words":["aa","aalenien"]}';
        const returnVal = component.verifyDict(component.selectedFile);
        expect(component.error).toEqual('Ce dictionnaire existe déjà');
        expect(returnVal).toBeFalsy();
    });

    it('verifyDict returns true if new dictionnary is valid', () => {
        component.selectedFile = '{"title": "test", "description": "ce dictionnaire est seulement un test", "words":["aa","aalenien"]}';
        const returnVal = component.verifyDict(component.selectedFile);
        expect(returnVal).toBeTruthy();
    });

    it('verifyDict returns false if new dictionnary is not valid', () => {
        component.selectedFile = '{"title": "test"}';
        const returnVal = component.verifyDict(component.selectedFile);
        expect(component.error).toEqual('FORMAT INVALIDE\n Il faut un titre, une description, un tableau de mots valide sans espace');
        expect(returnVal).toBeFalsy();
    });

    it('myErrorModify should return true', () => {
        const returnVal = component.myErrorModify('modifiedName', 'required');
        expect(returnVal).toBeTruthy();
    });

    it('myErrorAdd should return true', () => {
        const returnVal = component.myErrorAdd('newName', 'required');
        expect(returnVal).toBeTruthy();
    });
});
