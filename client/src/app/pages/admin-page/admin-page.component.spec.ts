/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { AdminPageComponent } from './admin-page.component';
import SpyObj = jasmine.SpyObj;

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let clientSocketHandlerSpy: SpyObj<ClientSocketHandler>;

    beforeEach(() => {
        clientSocketHandlerSpy = jasmine.createSpyObj(
            'ClientSocketHandler',
            [
                'connect',
                'getAdminPageInfo',
                'addVirtualPlayerNames',
                'deleteVirtualPlayerName',
                'modifyVirtualPlayerNames',
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
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ClientSocketHandler, useValue: clientSocketHandlerSpy }],
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

    it('openSnackBar should call open on the injected snack bar', () => {
        const snackSpy = spyOn(component.snackBar, 'open');
        component.openSnackBar('Allo', 'Bye');
        expect(snackSpy).toHaveBeenCalled();
        expect(snackSpy).toHaveBeenCalledWith('Allo', 'Bye', { duration: 2000 });
    });

    it('should add a new player', () => {
        component.virtualPlayerType = 'Débutant';
        component.virtualPlayerName = 'Player';
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.addNewPlayer();
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('should add a new player', () => {
        component.virtualPlayerType = 'Expert';
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
});
