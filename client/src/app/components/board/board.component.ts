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
        this.verificationSelection(current);
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
        }
    }

    verificationSelection(currentSelection: HTMLElement) {
        const board = document.getElementsByClassName('tile-container')[0];
        for (let i = 0; i < board.childElementCount; i++) {
            for (let j = 0; j < board.children[i].childElementCount; j++) {
                if (board.children[i].children[j].children[0].id === 'currentSelection') {
                    if (board.children[i].children[j].children[0] !== currentSelection) {
                        board.children[i].children[j].children[0].id = '';
                        this.clearSelection(board.children[i].children[j].children[0]);
                    }
                }
            }
        }
        currentSelection.id = 'currentSelection';
    }

    clearSelection(elementToClear: Element) {
        elementToClear.children[0].classList.replace('tileEmptyHorizontal', 'tileEmpty');
        elementToClear.children[0].classList.replace('tileEmptyVertical', 'tileEmpty');
    }
}
