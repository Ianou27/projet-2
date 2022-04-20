import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/../../../common/constants/board';
import { Vec2 } from '@app/../../../common/vec2';
import { GridService } from '@app/services/grid/grid.service';
import { ResizerService } from '@app/services/resizer/resizer.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    letterFontSize: number;
    mousePosition: Vec2;
    private canvasSize: Vec2;

    constructor(private readonly gridService: GridService, private resizer: ResizerService) {
        this.canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
        this.mousePosition = { x: 0, y: 0 };
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
}
