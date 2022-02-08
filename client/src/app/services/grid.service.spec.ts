import { TestBed } from '@angular/core/testing';
import { WORD_2X } from '@app/../../../common/constants/tile-information';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 750;
    const CANVAS_HEIGHT = 750;
    const fontSize = 14;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_HEIGHT);
    });

    it(' draw should call clear on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clearSpy = spyOn<any>(service, 'clear');
        service.draw(fontSize);
        expect(clearSpy).toHaveBeenCalled();
    });

    it(' draw should call drawGrid on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gridSpy = spyOn<any>(service, 'drawGrid');
        service.draw(fontSize);
        expect(gridSpy).toHaveBeenCalled();
    });

    it(' draw should call drawTiles on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawTilesSpy = spyOn<any>(service, 'drawTiles');
        service.draw(fontSize);
        expect(drawTilesSpy).toHaveBeenCalled();
    });

    it(' draw should call drawStar on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawStarSpy = spyOn<any>(service, 'drawStar');
        service.draw(fontSize);
        expect(drawStarSpy).toHaveBeenCalled();
    });

    it(' draw should call writeBonusTypes on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bonusTypeSpy = spyOn<any>(service, 'writeBonusTypes');
        service.draw(fontSize);
        expect(bonusTypeSpy).toHaveBeenCalled();
    });

    it(' writeBonusTypes should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        // eslint-disable-next-line dot-notation
        service['writeBonusTypes'](WORD_2X, fontSize);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' writeBonusTypes should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        // eslint-disable-next-line dot-notation
        service['writeBonusTypes'](WORD_2X, fontSize);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawTilesColor should call fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        // eslint-disable-next-line dot-notation
        service['drawTilesColor']('#FF0000', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' drawTilesColor should not call fillRect if color param is not a hex code', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        // eslint-disable-next-line dot-notation
        service['drawTilesColor']('test', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawTilesColor should not call fillRect if color param is empty', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        // eslint-disable-next-line dot-notation
        service['drawTilesColor']('', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawTilesColor should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        // eslint-disable-next-line dot-notation
        service['drawTilesColor']('#FF0000', WORD_2X);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 28 times', () => {
        const expectedCallTimes = 28;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        // eslint-disable-next-line dot-notation
        service['drawGrid']();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.draw(fontSize);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
});
