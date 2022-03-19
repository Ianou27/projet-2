import { Component, HostListener, OnInit } from '@angular/core';
import { BoardService } from '@app/services/board.service';
import { ChatService } from '@app/services/chat.service';
import { rowLetter } from './../../../../../common/assets/row';
import { MAXIMUM_ROW_COLUMN } from './../../../../../common/constants/general-constants';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    letterPlaced: string[] = [];
    orientation: string = '';
    constructor(public boardService: BoardService, public chatService: ChatService) {}
    @HostListener('keydown', ['$event'])
    keyHandler(event: KeyboardEvent) {
        // utilisation de code ne provenant pas de nous, source :
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        const key = event.key.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        switch (key) {
            case 'Escape': {
                this.clearAll();
                break;
            }
            case 'Backspace': {
                this.removeLetter();
                break;
            }
            case 'Enter': {
                this.placeWord();
                this.letterPlaced = [];
                break;
            }
            default: {
                this.placeLetter(key);
            }
        }
    }

    ngOnInit(): void {
        this.boardService.build();
    }

    clearAll() {
        if (!document.getElementsByClassName('written')[0]) return;
        while (this.letterPlaced.length !== 0) {
            this.removeLetter();
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
        let command = '!placer';
        try {
            document.getElementsByClassName('written')[0].getAttribute('data-position-x');
            document.getElementsByClassName('written')[0].getAttribute('data-position-y');
        } catch (e) {
            return;
        }
        const posX = Number(document.getElementsByClassName('written')[0].getAttribute('data-position-x')) + 1;
        const posY = rowLetter[Number(document.getElementsByClassName('written')[0].getAttribute('data-position-y'))];
        command += ' ' + posY + posX + this.orientation + ' ';
        for (let i = 0; i < this.letterPlaced.length; i++) {
            if (this.letterPlaced[i] === '*') {
                command += document.getElementsByClassName('written')[i].getElementsByTagName('p')[0].innerHTML;
                continue;
            }
            command += this.letterPlaced[i];
        }
        this.chatService.roomMessage = command;
        this.chatService.sendToRoom();
    }

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
        let lastArrow;
        if (this.orientation === 'h') {
            lastArrow = document.getElementById('arrow-right');
        } else {
            lastArrow = document.getElementById('arrow-down');
        }
        if (lastArrow) {
            lastArrow.id = '';
        }
        const position = this.getPosition(lastWrittenLetter);
        this.boardService.removeLetter(position[0], position[1]);
        if (this.orientation === 'h') {
            lastWrittenLetter.children[0].classList.replace('tile', 'tileEmptyHorizontal');
            lastWrittenLetter.children[0].id = 'arrow-right';
        }
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
            if (board.children[posX + 1].children[posY].children[0].getElementsByTagName('p')[0]) {
                this.nextTile(board.children[posX + 1].children[posY].children[0]);
            } else {
                board.children[posX + 1].children[posY].children[0].setAttribute('class', 'writing');
                board.children[posX + 1].children[posY].children[0].children[0].id = 'arrow-right';
            }
        } else {
            if (board.children[posX].children[posY + 1].children[0].getElementsByTagName('p')[0]) {
                this.nextTile(board.children[posX].children[posY + 1].children[0]);
            } else {
                board.children[posX].children[posY + 1].children[0].setAttribute('class', 'writing');
                board.children[posX].children[posY + 1].children[0].children[0].id = 'arrow-down';
            }
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
        this.boardService.setLetter(posX, posY, letter, value);
        lastWrittenTile.setAttribute('class', 'written');
        if (letter === letter.toUpperCase()) {
            this.letterPlaced.push('*');
        } else {
            this.letterPlaced.push(letter);
        }
        this.chatService.tileHolderService.removeLetter(letter);
    }

    handleLeftClick(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (!this.verificationSelection(current)) return;
        // if (!document.getElementsByClassName('tileEmptyHorizontal')[0] || !document.getElementsByClassName('tileEmptyVertical')) return;
        switch (current.children[0].classList[0]) {
            case 'tileEmpty': {
                current.children[0].classList.replace('tileEmpty', 'tileEmptyHorizontal');
                current.children[0].id = 'arrow-right';
                this.orientation = 'h';
                break;
            }
            case 'tileEmptyHorizontal': {
                current.children[0].classList.replace('tileEmptyHorizontal', 'tileEmptyVertical');
                current.children[0].id = 'arrow-down';
                this.orientation = 'v';
                break;
            }
            case 'tileEmptyVertical': {
                current.children[0].classList.replace('tileEmptyVertical', 'tileEmptyHorizontal');
                current.children[0].id = 'arrow-right';
                this.orientation = 'h';
                break;
            }
        }
    }

    private inTileHolder(key: string): [boolean, number] {
        return this.chatService.tileHolderService.letterInTileHolder(key);
    }

    private verificationSelection(currentSelection: HTMLElement): boolean {
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

    private clearSelection(elementToClear: Element) {
        elementToClear.children[0].classList.replace('tileEmptyHorizontal', 'tileEmpty');
        elementToClear.children[0].classList.replace('tileEmptyVertical', 'tileEmpty');
        elementToClear.children[0].id = '';
    }
}
