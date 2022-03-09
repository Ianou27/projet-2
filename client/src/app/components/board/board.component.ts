import { Component } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    constructor(public chatService: ChatService) {}

    handleLeftClick(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        console.log(current);

        current.id = 'currentSelection';
        // this.verificationSelection(current);
        switch (current.children[0].classList[0]) {
            case 'tileEmpty': {
                current.children[0].classList.replace('tileEmpty', 'tileEmptyHorizontal');
                break;
            }
            case 'tileEmptyHorizontal': {
                current.children[0].classList.replace('tileEmptyHorizontal', 'tileEmptyVertical');
                break;
            }
            case 'tileEmptyVertical': {
                current.children[0].classList.replace('tileEmptyVertical', 'tileEmptyHorizontal');
                break;
            }
            // No default
        }
    }

    /* verificationSelection(currentSelection: HTMLElement) {
        let currentSelectionCount = 0;
        if (currentSelection.parentElement) {
            for (let i = 0; i < currentSelection.parentElement.childElementCount; i++) {
                for (let j = 0; j < currentSelection.parentElement.childElementCount; j++) {
                    if (currentSelection.parentElement.parentElement.children[i].children[j].id) {
                        console.log(currentSelection.parentElement.children[i]);
                        currentSelectionCount++;
                    }
                    if (currentSelectionCount === 2) {
                        console.log(currentSelectionCount);
                        this.clearSelection(currentSelection);
                        break;
                    }
                }
            }
        }
        console.log('Fin de fnc' + currentSelectionCount);
    }*/

    clearSelection(currentSelection: HTMLElement) {
        if (currentSelection.parentElement) {
            for (let i = 0; i < currentSelection.parentElement.childElementCount; i++) {
                currentSelection.parentElement.children[i].id = '';
                currentSelection.parentElement.children[i].children[0].classList.replace('tileEmptyHorizontal', 'tileEmpty');
                currentSelection.parentElement.children[i].children[0].classList.replace('tileEmptyVertical', 'tileEmpty');
            }
        }
    }
}
