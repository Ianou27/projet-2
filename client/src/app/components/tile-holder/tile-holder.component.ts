import { Component, HostListener } from '@angular/core';
import { ChatService } from '@app/services/chat.service';
import { MouseService } from '@app/services/mouse.service';

@Component({
    selector: 'app-tile-holder',
    templateUrl: './tile-holder.component.html',
    styleUrls: ['./tile-holder.component.scss'],
})
export class TileHolderComponent {
    buttonPressed = '';
    index = 6;
    constructor(public chatService: ChatService, private mouseService: MouseService) {}

    @HostListener('body:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    select(event: MouseEvent) {
        this.mouseService.mouseHitDetect(event);
        console.log(this.mouseService.mouseHitDetect(event));
    }

    swap(elementPosition: number) {
        const tile = document.getElementById('tile-holder');
        let nextNode;
        if (tile) {
            nextNode = tile.children[elementPosition].nextSibling;
        }
        console.log(tile);
        console.log(elementPosition);
        if (this.buttonPressed === 'ArrowLeft' && tile) {
            tile.insertBefore(tile.children[elementPosition], tile.children[elementPosition].previousSibling);
        } else if (this.buttonPressed === 'ArrowRight' && nextNode && tile) {
            tile.insertBefore(tile.children[elementPosition], nextNode.nextSibling);
        }
    }
}
