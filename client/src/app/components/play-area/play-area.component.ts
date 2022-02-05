import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/board';
import { GridService } from '@app/services/grid.service';
import { MouseService } from '@app/services/mouse.service';
import { ResizerService } from '@app/services/resizer.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    letterFontSize: number;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private readonly gridService: GridService, private resizer: ResizerService, private mouseService: MouseService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngOnInit(): void {
        this.resizer.letterFontSize.subscribe((letterFontSize) => {
            this.letterFontSize = letterFontSize;
            this.gridService.draw(letterFontSize);
        });
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.draw(this.letterFontSize);
        this.gridCanvas.nativeElement.focus();
    }

    ngOnDestroy(): void {
        this.resizer.letterFontSize.unsubscribe();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    mouseHitDetect(event: MouseEvent) {
        this.mousePosition = this.mouseService.mouseHitDetect(event);
    }
}
