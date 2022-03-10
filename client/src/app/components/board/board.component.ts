import { Component, HostListener } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    letterPlaced: string[] = [];
    constructor(public chatService: ChatService) {}

    @HostListener('body:keydown', ['$event'])
    placeLetter(event: KeyboardEvent) {
        console.log(event.key);
        const currentTile = document.getElementById('currentSelection');
        console.log(currentTile);
        const key = event.key.toUpperCase();
        console.log(key);
        const keyInTileHolder = this.inTileHolder(key);
        console.log(keyInTileHolder);
        const tileHolder = document.getElementById('tile-holder');
        console.log(tileHolder);
        if (!keyInTileHolder[0]) return;
        if (!currentTile) return;
        if (!currentTile.getAttribute('ng-reflect-position-y')) return;
        console.log(currentTile.getAttribute('ng-reflect-position-y'));
        if (!currentTile.getAttribute('ng-reflect-position-x')) return;
         console.log(currentTile.getAttribute('ng-reflect-position-x'));
        const posX = Number(currentTile.getAttribute('ng-reflect-position-x'));
        const posY = Number(currentTile.getAttribute('ng-reflect-position-y'));
        if (posX && posY) {
            this.chatService.boardService.board[posX][posY].letter = key;
            this.chatService.boardService.board[posX][posY].value = Number(tileHolder?.children[keyInTileHolder[1]].getAttribute('ng-reflect-value'));
            this.letterPlaced.push(key);
        }
        console.log(key.toUpperCase());
        console.log(currentTile);
    }

    /* keyHandler(event: KeyboardEvent) {
        const key = event.key;
        switch (key) {
            case 'Backspace': {
                // move the currentSelection back
                // letterPlaced.pop()
                break;
            }
            case 'Enter': {
                // creates command and send it
                // clear array
                break;
            }
            default: {
                // ecrire sur le board
                // push into array
                // update currentSelection
            }
        }
        console.log(event.key);
    } */

    inTileHolder(key: string): [boolean, number] {
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                if (key === tileHolder.children[i].getAttribute('ng-reflect-letter')) {
                    return [true, i];
                }
            }
        }
        return [false, 0];
    }

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
