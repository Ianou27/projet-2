import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WaitingPlayerDialogComponent } from '@app/components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from '@app/components/waiting-player-two/waiting-player-two.component';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { BotType } from './../../../../../common/botType';
import { MyErrorStateMatcher } from './errorStateMatcher/error-state-matcher';

@Component({
    selector: 'app-join-page',
    templateUrl: './join-page.component.html',
    styleUrls: ['./join-page.component.scss'],
})
export class JoinPageComponent implements OnInit {
    name: string;
    confirmName: string;
    form: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    selectedDico = 'Dictionnaire par defaut';
    selectedPlayer = BotType.NoType;
    selectedTime = '60';
    selectedRoomName: string;
    matcher = new MyErrorStateMatcher();
    mode2990: boolean;

    time = [
        { value: '30', text: '0:30' },
        { value: '60', text: '1:00' },
        { value: '90', text: '1:30' },
        { value: '120', text: '2:00' },
        { value: '150', text: '2:30' },
        { value: '180', text: '3:00' },
        { value: '210', text: '3:30' },
        { value: '240', text: '4:00' },
        { value: '270', text: '4:30' },
        { value: '300', text: '5:00' },
    ];

    botType = [{ value: BotType.Beginner }, { value: BotType.Expert }];

    constructor(public waitDialog: MatDialog, public clientSocketHandler: ClientSocketHandler, @Inject(MAT_DIALOG_DATA) public data: string) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaNumericRegex)]),
        });
        if (this.data === 'mode2990') this.mode2990 = true;
        else this.mode2990 = false;
    }

    myError = (controlName: string, errorName: string) => {
        // eslint-disable-next-line no-invalid-this
        return this.form.controls[controlName].hasError(errorName);
    };
    openWait() {
        this.waitDialog.open(WaitingPlayerDialogComponent, {
            disableClose: true,
        });
    }
    openWaitToJoin() {
        this.waitDialog.open(WaitingPlayerTwoComponent, {
            disableClose: true,
        });
    }
    randomJoin() {
        const mode2990Rooms = this.clientSocketHandler.allRooms.filter((room) => room.mode2990 === true);
        const classicModeRooms = this.clientSocketHandler.allRooms.filter((room) => room.mode2990 === false);

        if (this.mode2990) {
            this.selectedRoomName = mode2990Rooms[Math.floor(Math.random() * mode2990Rooms.length)].player1;
        } else {
            this.selectedRoomName = classicModeRooms[Math.floor(Math.random() * classicModeRooms.length)].player1;
        }
    }

    createRoom() {
        this.clientSocketHandler.createRoom(this.name, this.name, this.selectedTime, this.mode2990);
        this.clientSocketHandler.username = this.name;
        this.openWait();
    }

    createSoloGame() {
        this.clientSocketHandler.createSoloGame(this.name, this.selectedTime, this.selectedPlayer, this.mode2990);
    }

    goHome() {
        this.waitDialog.closeAll();
    }
}
