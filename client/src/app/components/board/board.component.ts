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
    keyHandler(event: KeyboardEvent) {
        const key = event.key.toUpperCase();
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
                this.placeLetter(key);
            }
        }
    }

    /* nextTile(currentTile: Element) {
        if (!currentTile) return;
        currentTile.getAttribute()
    }*/

    /* placeLetter2(letter: string) {
        if (!this.inTileHolder(letter)[0]) return;
        const currentTile = document.getElementById('currentSelection');
        currentTile?.setAttribute('class', 'written');

    }*/

    placeLetter(letter: string) {
        const currentTile = document.getElementById('currentSelection');
        const writtenTiles = document.getElementsByClassName('writing');
        const lastWrittenTile = writtenTiles[writtenTiles.length - 1];
        const keyInTileHolder = this.inTileHolder(letter);
        const tileHolder = document.getElementById('tile-holder');
        console.log(!keyInTileHolder);
        if (!keyInTileHolder[0]) return;
        if (!currentTile) return;
        const posX = Number(lastWrittenTile.getAttribute('data-position-x'));
        console.log(posX);

        const posY = Number(lastWrittenTile.getAttribute('data-position-y'));
        console.log(posY);
        const value = Number(tileHolder?.children[keyInTileHolder[1]].getElementsByTagName('p')[1].innerHTML);
        this.chatService.boardService.setLetter(posX, posY, letter, value);
        lastWrittenTile.setAttribute('class', 'written');
        this.letterPlaced.push(letter);
        console.log(letter);
        console.log(currentTile);
    }

    inTileHolder(key: string): [boolean, number] {
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                try {
                    if (key === tileHolder.children[i].children[0].getElementsByTagName('p')[0].innerHTML) {
                        return [true, i];
                    }
                } catch (e) {
                    break;
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
                        board.children[i].children[j].children[0].className = '';
                        this.clearSelection(board.children[i].children[j].children[0]);
                    }
                }
            }
        }
        currentSelection.id = 'currentSelection';
        currentSelection.className = 'writing';
    }

    clearSelection(elementToClear: Element) {
        elementToClear.children[0].classList.replace('tileEmptyHorizontal', 'tileEmpty');
        elementToClear.children[0].classList.replace('tileEmptyVertical', 'tileEmpty');
    }
}
