import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WaitingPlayerDialogComponent } from '@app/components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from '@app/components/waiting-player-two/waiting-player-two.component';
import { ChatService } from '@app/services/chat.service';

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
    selectedTime = '60';

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

    constructor(public waitDialog: MatDialog, public chatService: ChatService) {}
    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaNumericRegex)]),
        });
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
        this.selectedRoomName = this.chatService.allRooms[Math.floor(Math.random() * this.chatService.allRooms.length)].player1;
    }

    createRoom() {
        this.chatService.createRoom(this.name, this.name, this.selectedTime);
        this.openWait();
    }

    goHome() {
        this.waitDialog.closeAll();
    }
}
