import { Component, HostListener } from '@angular/core';
import { TileHolderService } from '@app/services/tile-holder/tile-holder.service';
import { Tile } from './../../../../../common/tile/Tile';

@Component({
    selector: 'app-tile-holder',
    templateUrl: './tile-holder.component.html',
    styleUrls: ['./tile-holder.component.scss'],
})
export class TileHolderComponent {
    tileStyle: string = 'tile';
    buttonPressed = '';
    tile: Tile;
    letters: string[];
    firstOccurrence: string | undefined;
    scrollDirection = 0;
    parent = '';
    constructor(public tileHolderService: TileHolderService) {}

    @HostListener('body:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        const swapper = document.getElementById('swap-selected');
        this.buttonPressed = event.key;
        /* for (this.tile of this.tileHolderService.tileHolder) {
            if (this.tile.letter === this.buttonPressed.toUpperCase()) {
                console.log('yes');
            }
        } */
        if (this.buttonPressed === 'ArrowLeft' && swapper) {
            this.handleSide('Left', swapper);
        }
        if (this.buttonPressed === 'ArrowRight' && swapper) {
            this.handleSide('Right', swapper);
        }
    }
    @HostListener('body:mousewheel', ['$event'])
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

    addId(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        this.clearIds(current);
        current.id = 'swap-selected';
        current.children[0].classList.replace('tile', 'selected');
    }

    addSwapId(event: MouseEvent) {
        event.preventDefault();
        const current = event.currentTarget as HTMLElement;
        if (current.parentElement) {
            for (let i = 0; i < current.parentElement.childElementCount; i++) {
                if (current.parentElement.children[i].id === 'swap-selected') {
                    current.parentElement.children[i].id = '';
                    current.parentElement.children[i].children[0].classList.replace('selected', 'tile');
                }
            }
        }
        current.id = 'swap-reserve';
        current.children[0].classList.replace('tile', 'selected-reserve');
    }

    clearSwapReserve(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (current.previousElementSibling) {
            for (let i = 0; i < current.previousElementSibling.childElementCount; i++) {
                current.previousElementSibling.children[i].children[0].classList.replace('selected-reserve', 'tile');
            }
        }
    }

    private clearIds(current: HTMLElement) {
        if (current.parentElement) {
            for (let i = 0; i < current.parentElement.childElementCount; i++) {
                current.parentElement.children[i].id = '';
                current.parentElement.children[i].children[0].classList.replace('selected', 'tile');
                current.parentElement.children[i].children[0].classList.replace('selected-reserve', 'tile');
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
}
