import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WaitingPlayerDialogComponent } from '@app/components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from '@app/components/waiting-player-two/waiting-player-two.component';
import { Room } from './../../../../../common/types';
import { MyErrorStateMatcher } from './../../classes/errorStateMatcher/error-state-matcher';
import { JoinPageComponent } from './join-page.component';

describe('JoinPageComponent', () => {
    let component: JoinPageComponent;
    let fixture: ComponentFixture<JoinPageComponent>;
    let model: string;
    let matcher: MyErrorStateMatcher;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinPageComponent, WaitingPlayerDialogComponent, WaitingPlayerTwoComponent],
            imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
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
                {
                    provide: MyErrorStateMatcher,
                    useValue: (matcher = new MyErrorStateMatcher()),
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
            data: undefined,
        });
    });

    it('openWaitToJoin should call open on the dialog and disable the option to click outside to close', () => {
        const dialogSpy = spyOn(component.waitDialog, 'open');
        component.openWaitToJoin();
        expect(dialogSpy).toHaveBeenCalledWith(WaitingPlayerTwoComponent, {
            disableClose: true,
        });
    });

    it('randomJoin() without mode2990 should change the attribute selectedRoomName to a random room of mode classic clientSocketHandler', () => {
        const room: Room = {
            player1: 'player1',
            player2: 'player2',
            time: '60',
            mode2990: false,
        };
        component.clientSocketHandler.allRooms = [room];
        component.randomJoin();
        expect(component.selectedRoomName).toBe(room.player1);
    });

    it('randomJoin() with mode2990 should change the attribute selectedRoomName to a random room of mode2990 of clientSocketHandler', () => {
        component.mode2990 = true;
        const room: Room = {
            player1: 'player1',
            player2: 'player2',
            time: '60',
            mode2990: true,
        };
        component.clientSocketHandler.allRooms = [room];
        component.randomJoin();
        expect(component.selectedRoomName).toBe(room.player1);
    });

    it('createRoom() should create a room and open the dialog for the player that created the room', () => {
        const dialogMethodSpy = spyOn(component, 'openWait');
        const createSpy = spyOn(component.clientSocketHandler, 'createRoom');
        component.createRoom();
        expect(dialogMethodSpy).toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalled();
    });

    it('createSoloGame() should call the method createSoloGame from clientSocketHandler', () => {
        const createSoloGameSpy = spyOn(component.clientSocketHandler, 'createSoloGame');
        component.createSoloGame();
        expect(createSoloGameSpy).toHaveBeenCalled();
    });

    it('goHome() should close the dialog', () => {
        const closeSpy = spyOn(component.waitDialog, 'closeAll');
        matcher.isErrorState(null);
        component.goHome();
        expect(closeSpy).toHaveBeenCalled();
    });
});
