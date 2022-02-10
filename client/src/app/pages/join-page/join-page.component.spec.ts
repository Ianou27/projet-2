import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WaitingPlayerDialogComponent } from '@app/components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from '@app/components/waiting-player-two/waiting-player-two.component';
import { JoinPageComponent } from './join-page.component';

describe('JoinPageComponent', () => {
    let component: JoinPageComponent;
    let fixture: ComponentFixture<JoinPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinPageComponent, WaitingPlayerDialogComponent, WaitingPlayerTwoComponent],
            imports: [MatDialogModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {
                            return;
                        },
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openWait should call open on the dialog and disable the option to click outside to close', () => {
        const dialogSpy = spyOn(component.waitDialog, 'open');
        component.openWait();
        expect(dialogSpy).toHaveBeenCalledWith(WaitingPlayerDialogComponent, {
            disableClose: true,
        });
    });

    it('openWaitToJoin should call open on the dialog and disable the option to click outside to close', () => {
        const dialogSpy = spyOn(component.waitDialog, 'open');
        component.openWaitToJoin();
        expect(dialogSpy).toHaveBeenCalledWith(WaitingPlayerTwoComponent, {
            disableClose: true,
        });
    });

    it('createRoom() should create a room and open the dialog for the player that created the room', () => {
        const dialogMethodSpy = spyOn(component, 'openWait');
        const createSpy = spyOn(component.chatService, 'createRoom').and.callFake;
        component.createRoom();
        expect(dialogMethodSpy).toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalled();
    });
});
