import { Component, Inject } from '@angular/core';
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

    constructor(public dialogRef: MatDialogRef<MultiplayerPageComponent>, @Inject(MAT_DIALOG_DATA) public data: unknown) {}
    onCancel(): void {
        this.dialogRef.close();
    }
}
