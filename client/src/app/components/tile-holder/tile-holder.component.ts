import { Component, HostListener } from '@angular/core';
import { ChatService } from '@app/services/chat.service';

@Component({
    selector: 'app-tile-holder',
    templateUrl: './tile-holder.component.html',
    styleUrls: ['./tile-holder.component.scss'],
})
export class TileHolderComponent {
    buttonPressed = '';
    index = 6;
    parent = '';
    constructor(public chatService: ChatService) {}

    @HostListener('body:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        if (this.buttonPressed === 'ArrowLeft') {
            this.swap();
        }
        if (this.buttonPressed === 'ArrowRight') {
            this.swap();
        }
    }

    addId(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (current.id === 'swap-selected') {
            current.id = '';
        } else {
            current.id = 'swap-selected';
        }
    }

    swap() {
        const swapper = document.getElementById('swap-selected');
        let prevNode;
        let nextNode;
        if (swapper) {
            nextNode = swapper.nextElementSibling;
            prevNode = swapper.previousElementSibling;
        }
        if (this.buttonPressed === 'ArrowLeft' && swapper && prevNode && swapper.parentElement && swapper.parentElement.firstElementChild) {
            swapper.parentElement.insertBefore(swapper, prevNode);
            /* if (swapper.parentElement.firstElementChild.isEqualNode(swapper) && swapper.parentElement.lastElementChild) {
                swapper.parentElement.insertBefore(swapper, swapper.parentElement.lastElementChild.nextElementSibling);
            } */
        } else if (this.buttonPressed === 'ArrowRight' && nextNode && swapper && swapper.parentElement) {
            swapper.parentElement.insertBefore(swapper, nextNode.nextElementSibling);
            /* if (swapper.parentElement.firstElementChild?.previousElementSibling === swapper && swapper.parentElement.lastElementChild) {
                swapper.parentElement.insertBefore(swapper, swapper.parentElement.lastElementChild.nextElementSibling);
            } */
        }
    }
    /* swap(elementPosition: number) {
        const tile = document.getElementById('tile-holder');
        let current;
        let nextNode;
        let prevNode;
        if (tile) {
            current = tile.children[elementPosition];
            nextNode = tile.children[elementPosition].nextElementSibling;
            prevNode = tile.children[elementPosition].previousElementSibling;
        }
        console.log(tile);
        console.log(elementPosition);
        if (this.buttonPressed === 'ArrowLeft' && current && prevNode && tile) {
            tile.insertBefore(current, prevNode);
            elementPosition -= 1;
        } else if (this.buttonPressed === 'ArrowRight' && nextNode && tile) {
            tile.insertBefore(tile.children[elementPosition], nextNode.nextElementSibling);
        }
    } */
}
