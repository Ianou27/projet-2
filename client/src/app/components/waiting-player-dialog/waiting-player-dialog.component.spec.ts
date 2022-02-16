import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { WaitingPlayerDialogComponent } from './waiting-player-dialog.component';

describe('WaitingPlayerDialogComponent', () => {
    let component: WaitingPlayerDialogComponent;
    let fixture: ComponentFixture<WaitingPlayerDialogComponent>;

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
            ],
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
        const cancelSpy = spyOn(component.chatService, 'cancelCreation');
        component.goBack();
        expect(openSpy).toHaveBeenCalledWith(JoinPageComponent, {
            disableClose: true,
        });
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('accept() should close the dialogs and call accepted() in the chatService ', () => {
        // eslint-disable-next-line dot-notation
        const closeSpy = spyOn(component['multiplayerDialog'], 'closeAll');
        const acceptSpy = spyOn(component.chatService, 'accepted').and.stub();
        component.accept();
        expect(acceptSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('deny() should call refused() in the chatService and PlayerJoined value should be false ', () => {
        const refusedSpy = spyOn(component.chatService, 'refused');
        component.deny();
        expect(component.chatService.playerJoined).toBeFalsy();
        expect(refusedSpy).toHaveBeenCalled();
    });
});
