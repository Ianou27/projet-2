import { TestBed } from '@angular/core/testing';
// eslint-disable-next-line no-restricted-imports
import { Vec2 } from '../../../../../common/vec2';
import { MouseService } from './mouse.service';

describe('MouseService', () => {
    let service: MouseService;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseHitDetect should call service method', () => {
        const mouseServiceSpy = spyOn(service, 'mouseHitDetect');
        const expectedPosition: Vec2 = { x: 100, y: 200 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(mouseServiceSpy).toHaveBeenCalled();
    });

    it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
        const expectedPosition: Vec2 = { x: 100, y: 200 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.mousePosition).toEqual(expectedPosition);
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- Add reason */
    it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 1,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(service.mousePosition).toEqual(expectedPosition);
    });
});
