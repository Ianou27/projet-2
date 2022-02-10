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
    time: string;
    form: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    selectedDico = 'Dictionnaire par defaut';
    selectedTime = '1';

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

    createRoom() {
        this.chatService.createRoom(this.name, this.name);
        this.openWait();
    }
}
