import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WaitingPlayerDialogComponent } from '@app/components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from '@app/components/waiting-player-two/waiting-player-two.component';
import { FormatTimePipe } from '@app/pipes/format-time.pipe';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { Room } from './../../../../../common/types';
import { MyErrorStateMatcher } from './../../classes/errorStateMatcher/error-state-matcher';
import { JoinPageComponent } from './join-page.component';
import SpyObj = jasmine.SpyObj;

describe('JoinPageComponent', () => {
    let component: JoinPageComponent;
    let fixture: ComponentFixture<JoinPageComponent>;
    let model: string;
    let matcher: MyErrorStateMatcher;
    let clientSocketHandlerSpy: SpyObj<ClientSocketHandler>;

    beforeEach(() => {
        clientSocketHandlerSpy = jasmine.createSpyObj('ClientSocketHandler', ['connect', 'createRoom', 'createSoloGame', 'getAdminPageInfo'], {
            allRooms: [
                {
                    player1: 'player1',
                    player2: '',
                    time: '60',
                    mode2990: false,
                },
                {
                    player1: 'player1',
                    player2: '',
                    time: '60',
                    mode2990: true,
                },
            ],
            username: 'name',
            dictInfoList: [{ title: 'titre', description: 'description' }],
        });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinPageComponent, WaitingPlayerDialogComponent, WaitingPlayerTwoComponent, FormatTimePipe],
            imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
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

    it('should create classic mode', () => {
        expect(component).toBeTruthy();
        expect(component.mode2990).toEqual(false);
    });

    it('should create 2990 mode', () => {
        fixture = TestBed.createComponent(JoinPageComponent);
        component = fixture.componentInstance;
        component.data = 'mode2990';
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.mode2990).toEqual(true);
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
        component.createRoom();
        expect(dialogMethodSpy).toHaveBeenCalled();
    });

    it('createSoloGame() should call the method createSoloGame from clientSocketHandler', () => {
        component.createSoloGame();
    });

    it('goHome() should close the dialog', () => {
        const closeSpy = spyOn(component.waitDialog, 'closeAll');
        matcher.isErrorState(null);
        component.goHome();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('displayDictNames() should open and show the title of the dictionaries', () => {
        const dictionaryList = component.displayDictNames();
        expect(dictionaryList).toEqual(['titre']);
    });

    it('displayDescriptions() should open and show the description of the dictionaries', () => {
        const dictionary = component.displayDescriptions();
        expect(dictionary).toEqual(['description']);
    });
});
