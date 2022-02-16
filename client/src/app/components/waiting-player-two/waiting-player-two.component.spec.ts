import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CLOSING_DELAY } from '@app/constants/general-constants';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
import { WaitingPlayerTwoComponent } from './waiting-player-two.component';

describe('WaitingPlayerTwoComponent', () => {
    let component: WaitingPlayerTwoComponent;
    let fixture: ComponentFixture<WaitingPlayerTwoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingPlayerTwoComponent, JoinPageComponent],
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
        fixture = TestBed.createComponent(WaitingPlayerTwoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('join() should close the dialogs on both side and make the second player join the room ', () => {
        // eslint-disable-next-line dot-notation
        const closeSpy = spyOn(component['multiplayerDialog'], 'closeAll');
        const joinSpy = spyOn(component.chatService, 'joinRoom');
        component.join();
        expect(closeSpy).toHaveBeenCalled();
        expect(joinSpy).toHaveBeenCalled();
        expect(component.chatService.gotAccepted).toBeFalsy();
    });

    it('refused() should open the dialog', (done) => {
        // eslint-disable-next-line dot-notation
        const openSpy = spyOn(component['multiplayerDialog'], 'open');
        // eslint-disable-next-line dot-notation
        const closeSpy = spyOn(component['multiplayerDialog'], 'closeAll');
        component.refused();
        setTimeout(() => {
            expect(component.isBeingRedirected).toBeFalsy();
            expect(closeSpy).toHaveBeenCalled();
            expect(openSpy).toHaveBeenCalledWith(JoinPageComponent, { disableClose: true });
            done();
        }, CLOSING_DELAY);
        expect(component.chatService.gotRefused).toBeFalsy();
        expect(component.isBeingRedirected).toBeTruthy();
    });
});
