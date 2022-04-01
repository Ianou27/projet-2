/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
                'getDictionaryInfo',
                'getVirtualPlayerNames',
                'getHistory',
                'addVirtualPlayerNames',
                'deleteVirtualPlayerName',
                'modifyVirtualPlayerNames',
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
            imports: [AppMaterialModule, NoopAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ClientSocketHandler, useValue: clientSocketHandlerSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        /* component.defaultBeginnerNames = ['Felix', 'Richard', 'Riad'];
        component.defaultExpertNames = ['Ian', 'David', 'Nicolas'];
        component.addedBeginnerNames = ['Joe'];
        component.addedExpertNames = ['Jimmy']; */
    });

    it('should create', () => {
        console.log(fixture.debugElement.nativeElement);
        expect(component).toBeTruthy();
    });

    it('should add a new player', () => {
        component.virtualPlayerType = 'Débutant';
        component.virtualPlayerName = 'Player';
        // const addPlayerSpy = spyOn<any>(component.socketHandler, 'addVirtualPlayerNames').and.callThrough();
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.addNewPlayer();
        expect(refreshSpy).toHaveBeenCalled();
        // expect(addPlayerSpy).toHaveBeenCalled();
        // expect(addPlayerSpy).toHaveBeenCalledWith('Player', 'beginner');
    });

    /* it('should add a new player', () => {
        component.virtualPlayerType = 'Expert';
        component.virtualPlayerName = 'Player';
        fixture.detectChanges();
        // const addPlayerSpy = spyOn<any>(component.socketHandler, 'addVirtualPlayerNames').and.callThrough();
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData');
        component.addNewPlayer();
        expect(refreshSpy).toHaveBeenCalled();
        // expect(addPlayerSpy).toHaveBeenCalled();
        // expect(addPlayerSpy).toHaveBeenCalledWith('Player', 'beginner');
    }); */

    it('initialNameDisplay should call other methods', () => {
        const emptySpy = spyOn<any>(component, 'emptyArray');
        const setArraysSpy = spyOn<any>(component, 'setArrays');
        const setDisplayedSpy = spyOn<any>(component, 'setDisplayedNames');
        component.initialNameDisplay();
        expect(emptySpy).toHaveBeenCalled();
        expect(setArraysSpy).toHaveBeenCalled();
        expect(setDisplayedSpy).toHaveBeenCalled();
    });

    /* it('should delete player', (done) => {
        const refreshSpy = spyOn<any>(component, 'refreshDisplayedData').and.callThrough();
        component.setArrays();
        component.setDisplayedNames();
        setTimeout(() => {
            component.deletePlayerName('Joe');
            fixture.detectChanges();
            expect(refreshSpy).toHaveBeenCalled();
            expect(component.displayedNames).toEqual(['Jimmy']);
            done();
        }, 2000);
    }); */

    it('setDisplayedNames should set displayed names according to chosen player type', () => {
        component.displayDictNames();
        // expect(component.displayDictNames()).toEqual([{ title: 'titre', description: 'description' }]);
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

    it('emptyArray should empty the arrays displayed', () => {
        component.setArrays();
        component.emptyArray();
        expect(component.displayedFixedNames).toEqual([]);
        expect(component.displayedNames).toEqual([]);
    });
});
