/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { LETTER_3X, WORD_2X } from '@app/../../../common/constants/tile-information';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid/grid.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './../../../../../common/constants/board';

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

    it(' clear should call clearRect on grid context', () => {
        const clearSpy = spyOn<any>(service.gridContext, 'clearRect');
        service['clear']();
        expect(clearSpy).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalledWith(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    });

    it(' drawTiles should call drawTilesColor', () => {
        const drawTilesColorSpy = spyOn<any>(service, 'drawTilesColor');
        service['drawTiles']();
        expect(drawTilesColorSpy).toHaveBeenCalled();
        expect(drawTilesColorSpy).toHaveBeenCalledTimes(5);
    });

    it(' draw should call other methods', () => {
        const gridSpy = spyOn<any>(service, 'drawGrid');
        const clearSpy = spyOn<any>(service, 'clear');
        const drawTilesSpy = spyOn<any>(service, 'drawTiles');
        const drawStarSpy = spyOn<any>(service, 'drawStar');
        const bonusTypeSpy = spyOn<any>(service, 'writeBonusTypes');
        service.draw(fontSize);
        expect(clearSpy).toHaveBeenCalled();
        expect(gridSpy).toHaveBeenCalled();
        expect(drawTilesSpy).toHaveBeenCalled();
        expect(drawStarSpy).toHaveBeenCalled();
        expect(bonusTypeSpy).toHaveBeenCalled();
    });

    it(' draw not should call other methods if fontSize <= 0', () => {
        const gridSpy = spyOn<any>(service, 'drawGrid');
        const clearSpy = spyOn<any>(service, 'clear');
        const drawTilesSpy = spyOn<any>(service, 'drawTiles');
        const drawStarSpy = spyOn<any>(service, 'drawStar');
        const bonusTypeSpy = spyOn<any>(service, 'writeBonusTypes');
        service.draw(-1);
        expect(clearSpy).toHaveBeenCalledTimes(0);
        expect(gridSpy).toHaveBeenCalledTimes(0);
        expect(drawTilesSpy).toHaveBeenCalledTimes(0);
        expect(drawStarSpy).toHaveBeenCalledTimes(0);
        expect(bonusTypeSpy).toHaveBeenCalledTimes(0);
    });

    it(' writeBonusTypes should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        service['writeBonusTypes'](WORD_2X, fontSize);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' writeBonusTypes should not call fillText on the canvas if fontSize <= 0', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText');
        service['writeBonusTypes'](WORD_2X, -1);
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' writeBonusTypes should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['writeBonusTypes'](LETTER_3X, fontSize);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawTilesColor should call fillRect on the canvas', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        service['drawTilesColor']('#FF0000', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it(' drawTilesColor should not call fillRect if color param is not a hex code', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        service['drawTilesColor']('test', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawTilesColor should not call fillRect if color param is empty', () => {
        const fillRectSpy = spyOn(service.gridContext, 'fillRect');
        service['drawTilesColor']('', WORD_2X);
        expect(fillRectSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawTilesColor should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['drawTilesColor']('#FF0000', WORD_2X);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 28 times', () => {
        const expectedCallTimes = 28;
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        service['drawGrid']();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['drawGrid']();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawStar should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['drawStar'](1, 50);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawStar should not color pixels on the canvas if params <= 0', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service['drawStar'](0, -4);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBe(beforeSize);
    });
});
