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
        const swapper = document.getElementById('swap-selected');
        this.buttonPressed = event.key;
        if (this.buttonPressed === 'ArrowLeft' && swapper) {
            if (this.isAtExtremity(swapper) === 'Left') {
                this.endToEnd(swapper);
            } else {
                this.swap();
            }
        }
        if (this.buttonPressed === 'ArrowRight' && swapper) {
            if (this.isAtExtremity(swapper) === 'Right') {
                this.endToEnd(swapper);
            } else {
                this.swap();
            }
        }
    }

    addId(event: MouseEvent) {
        this.clearIds(event);
        const current = event.currentTarget as HTMLElement;
        if (current.id === 'swap-selected') {
            current.id = '';
        } else {
            current.id = 'swap-selected';
        }
    }

    private clearIds(event: MouseEvent) {
        const current = event.currentTarget as HTMLElement;
        if (current.parentElement) {
            for (let i = 0; i < current.parentElement.childElementCount; i++) {
                current.parentElement.children[i].id = '';
            }
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
        if (this.buttonPressed === 'ArrowLeft' && swapper && prevNode && swapper.parentElement && swapper.parentElement.firstElementChild) {
            swapper.parentElement.insertBefore(swapper, prevNode);
        } else if (this.buttonPressed === 'ArrowRight' && nextNode && swapper && swapper.parentElement) {
            swapper.parentElement.insertBefore(swapper, nextNode.nextElementSibling);
        }
    }

    private endToEnd(swapper: HTMLElement) {
        if (this.buttonPressed === 'ArrowLeft' && swapper && swapper.parentElement && swapper.parentElement.lastElementChild) {
            swapper.parentElement.insertBefore(swapper, swapper.parentElement.lastElementChild.nextElementSibling);
        } else if (this.buttonPressed === 'ArrowRight' && swapper && swapper.parentElement && swapper.parentElement.firstElementChild) {
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
