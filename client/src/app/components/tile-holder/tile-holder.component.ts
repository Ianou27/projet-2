import { Component, HostListener } from '@angular/core';
import { TileHolderService } from '@app/services/tile-holder/tile-holder.service';

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
    showButtonsBool: boolean = false;
    constructor(public tileHolderService: TileHolderService) {}

    @HostListener('body:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        const swapper = document.getElementById('swap-selected');
        this.buttonPressed = event.key;
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
            this.clearAllIds(swapper);
        }
    }
    @HostListener('mousewheel', ['$event'])
    onScroll(event: WheelEvent) {
        const swapper = document.getElementById('swap-selected');
        this.scrollDirection = event.deltaY;
        if (this.scrollDirection < 0 && swapper) {
            this.handleSide('Left', swapper);
        }
        if (this.scrollDirection > 0 && swapper) {
            this.handleSide('Right', swapper);
        }
    }
    @HostListener('blur', ['$event'])
    clickOut() {
        const tile = document.getElementsByTagName('app-tile')[225] as HTMLElement;
        this.clearAllIds(tile);
    }

    addId(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        this.clearAllIds(current);
        current.id = 'swap-selected';
        current.children[0].classList.replace('tile', 'selected');
    }

    addExchangeId(event: MouseEvent) {
        event.preventDefault();
        const current = event.currentTarget as HTMLElement;
        this.clearSelectedId(current);
        if (current.id === '') {
            current.id = 'swap-reserve';
            current.children[0].classList.replace('tile', 'selected-reserve');
        } else if (current.id === 'swap-reserve') {
            current.id = '';
            current.children[0].classList.replace('selected-reserve', 'tile');
        }
        this.showButtonsBool = this.checkForID();
    }

    clearExchangeId(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (current.previousElementSibling) {
            for (let i = 0; i < current.previousElementSibling.childElementCount; i++) {
                current.previousElementSibling.children[i].id = '';
                current.previousElementSibling.children[i].children[0].classList.replace('selected-reserve', 'tile');
            }
        }
        this.showButtonsBool = false;
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

    private clearAllIds(current: HTMLElement) {
        if (current.parentElement) {
            for (let i = 0; i < current.parentElement.childElementCount; i++) {
                current.parentElement.children[i].id = '';
                current.parentElement.children[i].children[0].classList.replace('selected', 'tile');
                current.parentElement.children[i].children[0].classList.replace('selected-reserve', 'tile');
            }
        }
        this.showButtonsBool = this.checkForID();
    }

    private clearSelectedId(current: HTMLElement) {
        if (current.parentElement) {
            for (let i = 0; i < current.parentElement.childElementCount; i++) {
                if (current.parentElement.children[i].id === 'swap-selected') {
                    current.parentElement.children[i].id = '';
                    current.parentElement.children[i].children[0].classList.replace('selected', 'tile');
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
        } else if ((this.buttonPressed === 'ArrowRight' || this.scrollDirection > 0) && nextNode && swapper && swapper.parentElement) {
            swapper.parentElement.insertBefore(swapper, nextNode.nextElementSibling);
        }
    }

    private endToEnd(swapper: HTMLElement) {
        if (
            (this.buttonPressed === 'ArrowLeft' || this.scrollDirection < 0) &&
            swapper &&
            swapper.parentElement &&
            swapper.parentElement.lastElementChild
        ) {
            swapper.parentElement.insertBefore(swapper, swapper.parentElement.lastElementChild.nextElementSibling);
        } else if (
            (this.buttonPressed === 'ArrowRight' || this.scrollDirection > 0) &&
            swapper &&
            swapper.parentElement &&
            swapper.parentElement.firstElementChild
        ) {
            swapper.parentElement.insertBefore(swapper, swapper.parentElement.firstElementChild);
        }
    }

    private isAtExtremity(node: HTMLElement) {
        if (node.parentElement && node.parentElement.lastElementChild) {
            if (node.isEqualNode(node.parentElement.firstElementChild)) return 'Left';
            if (node.isEqualNode(node.parentElement.lastElementChild)) return 'Right';
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
            } else if (parent && (this.count >= indexes.length - 1 || lastKey !== this.buttonPressed)) {
                this.count = 0;
                current = parent.children[indexes[this.count]] as HTMLElement;
            }
            this.count++;
        }
        if (current) {
            this.clearAllIds(current);
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
}
