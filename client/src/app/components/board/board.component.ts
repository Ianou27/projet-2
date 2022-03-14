import { Component, HostListener } from '@angular/core';
import { ChatService } from '@app/services/chat.service';
import { MAXIMUM_ROW_COLUMN } from './../../../../../common/constants/general-constants';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    letterPlaced: string[] = [];
    orientation: string = '';
    constructor(public chatService: ChatService) {}

    @HostListener('keydown', ['$event'])
    keyHandler(event: KeyboardEvent) {
        const key = event.key;

        switch (key) {
            case 'Backspace': {
                this.removeLetter();
                break;
            }
            case 'Enter': {
                // creates command and send it
                // clear array
                break;
            }
            default: {
                this.placeLetter(key);
                console.log(this.letterPlaced);
            }
        }
    }

    getPosition(tile: Element): [number, number] {
        try {
            tile.getAttribute('data-position-x');
            tile.getAttribute('data-position-y');
        } catch (e) {
            return [0, 0];
        }
        return [Number(tile.getAttribute('data-position-x')), Number(tile.getAttribute('data-position-y'))];
    }

    placeWord() {
        // besoin de déplacer rowNumber dans common
        /* let command = '!placer';
        const posX = document.getElementsByClassName('written')[0].getAttribute('data-position-x');
        const posY = document.getElementsByClassName('written')[0].getAttribute('data-position-y');
        
        for (const letter of this.letterPlaced) {
            
        }*/
    }

    // voir lettre majuscule sans lettre etoile

    removeLetter() {
        if (document.getElementsByClassName('writing')[0]) document.getElementsByClassName('writing')[0].className = '';
        if (this.letterPlaced.length === 0) return;
        const letter = this.letterPlaced[this.letterPlaced.length - 1];
        this.chatService.tileHolderService.addLetter(letter);
        this.letterPlaced.pop();
        const writtenLetters = document.getElementsByClassName('written');
        const lastWrittenLetter = writtenLetters[writtenLetters.length - 1];
        if (!lastWrittenLetter) return;
        lastWrittenLetter.setAttribute('class', 'writing');
        const position = this.getPosition(lastWrittenLetter);
        this.chatService.boardService.removeLetter(position[0], position[1]);
    }

    nextTile(currentTile: Element) {
        const board = document.getElementsByClassName('tile-container')[0];
        try {
            currentTile.getAttribute('data-position-x');
            currentTile.getAttribute('data-position-y');
        } catch (e) {
            return;
        }
        const posX = Number(currentTile.getAttribute('data-position-x'));
        const posY = Number(currentTile.getAttribute('data-position-y'));
        if (posX === MAXIMUM_ROW_COLUMN || posY === MAXIMUM_ROW_COLUMN) return;
        if (this.orientation === 'h') {
            board.children[posX + 1].children[posY].children[0].setAttribute('class', 'writing');
        } else {
            board.children[posX].children[posY + 1].children[0].setAttribute('class', 'writing');
        }
    }

    placeLetter(letter: string) {
        if (/[^a-zA-Z]/.test(letter)) return;
        const lastWrittenTile = document.getElementsByClassName('writing')[0];
        const keyInTileHolder = this.inTileHolder(letter);
        const tileHolder = document.getElementById('tile-holder');
        if (!keyInTileHolder[0]) return;
        this.nextTile(lastWrittenTile);
        const posX = Number(lastWrittenTile.getAttribute('data-position-x'));
        const posY = Number(lastWrittenTile.getAttribute('data-position-y'));
        const value = Number(tileHolder?.children[keyInTileHolder[1]].getElementsByTagName('p')[1].innerHTML);
        this.chatService.boardService.setLetter(posX, posY, letter, value);
        lastWrittenTile.setAttribute('class', 'written');
        if (this.isUpper(letter)) {
            this.letterPlaced.push('*');
        } else {
            this.letterPlaced.push(letter);
        }
        this.chatService.tileHolderService.removeLetter(letter);
    }

    isUpper(letter: string) {
        if (letter === letter.toUpperCase()) return true;
        return false;
    }

    inTileHolder(key: string): [boolean, number] {
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                try {
                    if (this.isUpper(key)) {
                        if ('*' === tileHolder.children[i].children[0].getElementsByTagName('p')[0].innerHTML) return [true, i];
                        return [false, 0];
                    }
                    if (key.toUpperCase() === tileHolder.children[i].children[0].getElementsByTagName('p')[0].innerHTML) {
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
        if (!this.verificationSelection(current))
            if (!document.getElementsByClassName('tileEmptyHorizontal')[0] || !document.getElementsByClassName('tileEmptyVertical')) return;
        switch (current.children[0].classList[0]) {
            case 'tileEmpty': {
                current.children[0].classList.replace('tileEmpty', 'tileEmptyHorizontal');
                this.orientation = 'h';
                break;
            }
            case 'tileEmptyHorizontal': {
                current.children[0].classList.replace('tileEmptyHorizontal', 'tileEmptyVertical');
                this.orientation = 'v';
                break;
            }
            case 'tileEmptyVertical': {
                current.children[0].classList.replace('tileEmptyVertical', 'tileEmptyHorizontal');
                this.orientation = 'h';
                break;
            }
        }
    }

    verificationSelection(currentSelection: HTMLElement): boolean {
        const board = document.getElementsByClassName('tile-container')[0];
        const alreadyWriting = document.getElementsByClassName('written')[0];
        if (alreadyWriting) return false;
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
        return true;
    }

    clearSelection(elementToClear: Element) {
        elementToClear.children[0].classList.replace('tileEmptyHorizontal', 'tileEmpty');
        elementToClear.children[0].classList.replace('tileEmptyVertical', 'tileEmpty');
    }
}
