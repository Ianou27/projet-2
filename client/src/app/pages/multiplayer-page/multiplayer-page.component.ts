import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-multiplayer-page',
    templateUrl: './multiplayer-page.component.html',
    styleUrls: ['./multiplayer-page.component.scss'],
})
export class MultiplayerPageComponent {
    name: string;
    time: string; // number;
    options: string[] = ['Dictionnaire par défaut', 'Dictionnaire qui n`est pas la'];
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<MultiplayerPageComponent>, @Inject(MAT_DIALOG_DATA) public data: unknown) {}
    onCancel(): void {
        this.dialogRef.close();
    }
    save(): void {
        this.dialogRef.close(this.form.value);
    }
}
