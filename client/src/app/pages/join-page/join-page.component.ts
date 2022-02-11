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
    time: string;
    form: FormGroup;
    // usernamePlayer1: string;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    selectedDico = 'Dictionnaire par defaut';
    selectedTime = '1';
    registerForm: FormGroup;

    constructor(public waitDialog: MatDialog, public chatService: ChatService) {
        // this.usernamePlayer1 = this.chatService.allRooms[0].player1;
    }
    ngOnInit(): void {
        this.form = new FormGroup(
            {
                name: new FormControl('', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.pattern(this.alphaNumericRegex),
                    // Validators.pattern(this.usernamePlayer1),
                ]),
                // confirmName: new FormControl('', [Validators.required]),
            },
            // {
            //     validator: compareName('name', 'confirmName'),
            // },
        );
    }

    get f() {
        return this.registerForm.controls;
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

    goHome() {
        this.waitDialog.closeAll();
        window.location.href = '/home';
    }
}
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function compareName(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
