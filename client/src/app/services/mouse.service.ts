import { Injectable } from '@angular/core';
import { Vec2 } from '@app/../../../common/vec2';
import { MouseButton } from '@app/constants/general-constants';

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    mousePosition: Vec2 = { x: 0, y: 0 };
    mouseHitDetect(event: MouseEvent): Vec2 {
        if (event.button === MouseButton.Left) {
            return (this.mousePosition = { x: event.offsetX, y: event.offsetY });
        }
        return this.mousePosition;
    }
}
