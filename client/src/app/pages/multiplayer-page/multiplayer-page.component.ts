import { Component, /* Inject, */ OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef /* , MAT_DIALOG_DATA*/ } from '@angular/material/dialog';

@Component({
    selector: 'app-multiplayer-page',
    templateUrl: './multiplayer-page.component.html',
    styleUrls: ['./multiplayer-page.component.scss'],
})
export class MultiplayerPageComponent implements OnInit {
    name: string;
    time: string;
    form: FormGroup;
    alphaNumericRegex = /^[a-zA-Z]*$/;
    selectedDico = 'Dictionnaire de base';
    selectedTime = '1';

    constructor(public dialogRef: MatDialogRef<MultiplayerPageComponent>) {} // , @Inject(MAT_DIALOG_DATA) public data: unknown) {}
    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaNumericRegex)]),
        });
    }
    myError = (controlName: string, errorName: string) => {
        // eslint-disable-next-line no-invalid-this
        return this.form.controls[controlName].hasError(errorName);
    };

    onCancel(): void {
        this.dialogRef.close();
    }
    // save(): void {
    //     this.dialogRef.close(this.form.value);
    // }
}
