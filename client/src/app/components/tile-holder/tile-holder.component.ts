import { Component, HostListener } from '@angular/core';
import { ChatService } from '@app/services/chat.service';
import { TileHolderService } from '@app/services/tile-holder/tile-holder.service';
import { NUMBER_TILEHOLDER } from './../../../../../common/constants/general-constants';

@Component({
    selector: 'app-tile-holder',
    templateUrl: './tile-holder.component.html',
    styleUrls: ['./tile-holder.component.scss'],
})
export class TileHolderComponent {
    buttonPressed = '';
    scrollDirection = 0;
    count = 0;
    lastKeys: string[] = [];
    lettersToExchange: string[] = [];
    showButtonsBool: boolean = false;
    constructor(public tileHolderService: TileHolderService, public chatService: ChatService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        const swapper = document.getElementById('swap-selected');
        this.buttonPressed = event.key;
        this.scrollDirection = 0;
        if (this.buttonPressed === 'ArrowLeft' && swapper) {
            this.handleSide('Left', swapper);
        }
        if (this.buttonPressed === 'ArrowRight' && swapper) {
            this.handleSide('Right', swapper);
        }
        if (this.getLettersOnHolder().includes(this.buttonPressed.toUpperCase())) {
            const indexes = this.findLetterIndexes(this.buttonPressed.toUpperCase());
            this.addIdOnKey(indexes);
        } else if (
            swapper &&
            !this.getLettersOnHolder().includes(this.buttonPressed.toUpperCase()) &&
            !(this.buttonPressed === 'ArrowLeft') &&
            !(this.buttonPressed === 'ArrowRight')
        ) {
            this.count = 0;
            this.clearAllIds();
        }
    }
    @HostListener('mousewheel', ['$event'])
    onScroll(event: WheelEvent) {
        const swapper = document.getElementById('swap-selected');
        this.buttonPressed = '';
        this.scrollDirection = event.deltaY;
        if (this.scrollDirection < 0 && swapper) {
            this.handleSide('Left', swapper);
        }
        if (this.scrollDirection > 0 && swapper) {
            this.handleSide('Right', swapper);
        }
    }

    clearAllIds() {
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                tileHolder.children[i].id = '';
                tileHolder.children[i].children[0].classList.replace('selected', 'tile');
                tileHolder.children[i].children[0].classList.replace('selected-reserve', 'tile');
            }
        }
        this.showButtonsBool = this.checkForID();
        this.emptyArray();
    }

    addId(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (current.id === '') {
            this.clearSelectedId();
            current.id = 'swap-selected';
            current.children[0].classList.replace('tile', 'selected');
        }
    }

    addExchangeId(event: MouseEvent) {
        event.preventDefault();
        const current = event.currentTarget as HTMLElement;
        this.clearSelectedId();
        if (current.id === '' && current.children[0].children[0].textContent) {
            current.id = 'swap-reserve';
            current.children[0].classList.replace('tile', 'selected-reserve');
            this.lettersToExchange.push(current.children[0].children[0].textContent.toLowerCase());
        } else if (current.id === 'swap-reserve' && current.children[0].children[0].textContent) {
            current.id = '';
            current.children[0].classList.replace('selected-reserve', 'tile');
            const index = this.lettersToExchange.indexOf(current.children[0].children[0].textContent.toLowerCase());
            this.lettersToExchange.splice(index, 1);
        }
        this.showButtonsBool = this.checkForID();
    }

    exchange() {
        let command = '!échanger ';
        const letters = this.lettersToExchange.join('');
        command += letters;
        this.chatService.roomMessage = command;
        this.chatService.sendToRoom();
        this.showButtonsBool = false;
        this.emptyArray();
    }

    private checkForID() {
        const parent = document.getElementById('tile-holder');
        if (parent) {
            for (let i = 0; i < parent.childElementCount; i++) {
                if (parent.children[i].id === 'swap-reserve') {
                    return true;
                }
            }
        }
        return false;
    }

    private clearSelectedId() {
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                if (tileHolder.children[i].id === 'swap-selected') {
                    tileHolder.children[i].id = '';
                    tileHolder.children[i].children[0].classList.replace('selected', 'tile');
                }
            }
        }
    }

    private handleSide(side: string, swapper: HTMLElement) {
        if (this.isAtExtremity(swapper) === side) {
            this.endToEnd(swapper);
        } else {
            this.swap();
        }
    }

    private swap() {
        const swapper = document.getElementById('swap-selected');
        let prevNode;
        let nextNode;
        if (swapper) {
            nextNode = swapper.nextElementSibling;
            prevNode = swapper.previousElementSibling;
        }
        if ((this.buttonPressed === 'ArrowLeft' || this.scrollDirection < 0) && swapper && prevNode && swapper.parentElement) {
            swapper.parentElement.insertBefore(swapper, prevNode);
        } else if ((this.buttonPressed === 'ArrowRight' || this.scrollDirection > 0) && swapper && nextNode && swapper.parentElement) {
            swapper.parentElement.insertBefore(swapper, nextNode.nextElementSibling);
        }
    }

    private endToEnd(swapper: HTMLElement) {
        const parent = swapper.parentElement;
        const lastChild = parent?.lastElementChild;
        const firstChild = parent?.firstElementChild;
        if ((this.buttonPressed === 'ArrowLeft' || this.scrollDirection < 0) && parent && lastChild) {
            parent.insertBefore(swapper, lastChild.nextElementSibling);
        } else if ((this.buttonPressed === 'ArrowRight' || this.scrollDirection > 0) && parent && firstChild) {
            parent.insertBefore(swapper, firstChild);
        }
    }

    private isAtExtremity(node: HTMLElement) {
        const parent = node.parentElement;
        const lastChild = parent?.lastElementChild;
        const firstChild = parent?.firstElementChild;
        if (firstChild && lastChild) {
            if (node.isEqualNode(firstChild)) return 'Left';
            if (node.isEqualNode(lastChild)) return 'Right';
        }
        return '';
    }

    private getLettersOnHolder() {
        const letterArray = [];
        const tileHolder = document.getElementById('tile-holder');
        if (tileHolder) {
            for (let i = 0; i < tileHolder.childElementCount; i++) {
                if (tileHolder.children[i].children[0].children[0]) {
                    letterArray.push(tileHolder.children[i].children[0].children[0].textContent);
                }
            }
        }
        return letterArray;
    }

    private findLetterIndexes(letter: string) {
        const letterArray = this.getLettersOnHolder();
        const indexes = letterArray
            .map((x, index) => {
                if (x === letter) {
                    return index;
                }
                return -1;
            })
            .filter((x) => x !== -1);
        return indexes;
    }

    private addIdOnKey(indexes: number[]) {
        const parent = document.getElementById('tile-holder');
        const lastKey = this.getLastKey();
        let current;
        if (indexes.length === 1 && parent) {
            current = parent.children[indexes[0]] as HTMLElement;
        } else {
            if (parent && this.count < indexes.length && lastKey === this.buttonPressed) {
                current = parent.children[indexes[this.count]] as HTMLElement;
                if (current.id !== '') {
                    this.count++;
                    current = parent.children[indexes[this.count]] as HTMLElement;
                }
            } else if (parent && (this.count >= indexes.length - 1 || lastKey !== this.buttonPressed)) {
                this.count = 0;
                current = parent.children[indexes[this.count]] as HTMLElement;
            }
            this.count++;
        }
        if (current && current.id === '') {
            this.clearSelectedId();
            current.id = 'swap-selected';
            current.children[0].classList.replace('tile', 'selected');
        }
    }

    private getLastKey() {
        this.lastKeys.push(this.buttonPressed);
        if (this.lastKeys.length > 2) {
            this.lastKeys.shift();
        }
        return this.lastKeys[0];
    }

    private emptyArray() {
        for (let i = 0; i < NUMBER_TILEHOLDER; i++) {
            this.lettersToExchange.pop();
        }
    }
}
