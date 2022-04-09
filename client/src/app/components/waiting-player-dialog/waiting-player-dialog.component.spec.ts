import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { WaitingPlayerDialogComponent } from './waiting-player-dialog.component';

describe('WaitingPlayerDialogComponent', () => {
    let component: WaitingPlayerDialogComponent;
    let fixture: ComponentFixture<WaitingPlayerDialogComponent>;
    let model: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingPlayerDialogComponent, JoinPageComponent],
            imports: [MatDialogModule],
            providers: [
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
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: model,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingPlayerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('goBack() should open the dialog and cancel room creation', () => {
        // eslint-disable-next-line dot-notation
        const openSpy = spyOn(component['multiplayerDialog'], 'open');
        const cancelSpy = spyOn(component.clientSocketHandler, 'cancelCreation');
        component.goBack();
        expect(openSpy).toHaveBeenCalledWith(JoinPageComponent, {
            disableClose: true,
        });
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('accept() should close the dialogs and call accepted() in the clientSocketHandler ', () => {
        // eslint-disable-next-line dot-notation
        const closeSpy = spyOn(component['multiplayerDialog'], 'closeAll');
        const acceptSpy = spyOn(component.clientSocketHandler, 'accepted').and.stub();
        component.accept();
        expect(acceptSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('deny() should call refused() in the clientSocketHandler and PlayerJoined value should be false ', () => {
        const refusedSpy = spyOn(component.clientSocketHandler, 'refused');
        component.deny();
        expect(component.clientSocketHandler.playerJoined).toBeFalsy();
        expect(refusedSpy).toHaveBeenCalled();
    });

    it('convertToSolo() should call convertToSoloGame() in the clientSocketHandler and close all dialogs', () => {
        // eslint-disable-next-line dot-notation
        const closeSpy = spyOn(component['multiplayerDialog'], 'closeAll');
        const refusedSpy = spyOn(component.clientSocketHandler, 'convertToSoloGame');
        component.convertToSolo();
        expect(refusedSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
    });
});
