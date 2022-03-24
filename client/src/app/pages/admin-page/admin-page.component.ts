import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    isChecked: boolean = false;
    virtualPlayer: string = 'Débutants';
    selectedDico = 'Dictionnaire par défaut';

    changeType() {
        if (this.virtualPlayer === 'Débutants') {
            this.virtualPlayer = 'Experts';
        } else {
            this.virtualPlayer = 'Débutants';
        }
    }
}
