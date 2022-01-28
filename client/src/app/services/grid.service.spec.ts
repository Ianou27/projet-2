import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { WORD_3X } from '@app/constants/tile-information';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

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

    it(' writeBonusTypes should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.writeBonusTypes('test', 'another test', WORD_3X);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' writeBonusTypes should not call fillText if words are empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.writeBonusTypes('', '', WORD_3X);
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' writeBonusTypes should not call fillText if one word is empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.writeBonusTypes('test', '', WORD_3X);
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' writeBonusTypes should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.writeBonusTypes('test', 'another test', WORD_3X);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawTilesColor should call fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.drawTilesColor('#FF0000', WORD_3X);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' drawTilesColor should not call fillRect if entry is not a hex code', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        service.drawTilesColor('test', WORD_3X);
        expect(fillRectSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawTilesColor should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawTilesColor('#FF0000', WORD_3X);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 28 times', () => {
        const expectedCallTimes = 28;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
});
