import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatService } from '@app/services/chat.service';
import { TileHolderService } from '@app/services/tile-holder/tile-holder.service';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';
import { TileComponent } from './../tile/tile.component';
import { TileHolderComponent } from './tile-holder.component';
import SpyObj = jasmine.SpyObj;

describe('TileHolderComponent', () => {
    let component: TileHolderComponent;
    let fixture: ComponentFixture<TileHolderComponent>;
    let tileHolderServiceSpy: SpyObj<TileHolderService>;
    let chatServiceSpy: SpyObj<ChatService>;
    let tiles: Tile[];
    let swapper: HTMLElement;

    beforeEach(() => {
        tiles = [];
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['sendToRoom'], ['roomMessage']);
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        for (const letter of letters) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = letter;
            tile.value = letterValue[letter];
            tiles.push(tile);
        }
        tileHolderServiceSpy = jasmine.createSpyObj('TileHolderService', {}, { tileHolder: tiles });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileHolderComponent, TileComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: TileHolderService, useValue: tileHolderServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TileHolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'z';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('Pressing the left arrow key should call handleSide method', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        const expectedKey = 'ArrowLeft';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSideSpy = spyOn<any>(component, 'handleSide');
        component.buttonDetect(buttonEvent);
        fixture.whenStable().then(() => {
            expect(handleSideSpy).toHaveBeenCalled();
            expect(handleSideSpy).toHaveBeenCalledWith('Left', swapper);
            done();
        });
    });

    it('Pressing the right arrow key should call handleSide method', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        const expectedKey = 'ArrowRight';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSideSpy = spyOn<any>(component, 'handleSide');
        component.buttonDetect(buttonEvent);
        fixture.whenStable().then(() => {
            expect(handleSideSpy).toHaveBeenCalled();
            expect(handleSideSpy).toHaveBeenCalledWith('Right', swapper);
            done();
        });
    });

    it('buttonDetect should clear all ids if the buttonPressed is not in tile holder or is not side arrow keys', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        const expectedKey = 'z';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clearIdSpy = spyOn<any>(component, 'clearAllIds');
        component.buttonDetect(buttonEvent);
        fixture.whenStable().then(() => {
            expect(component.count).toEqual(0);
            expect(clearIdSpy).toHaveBeenCalled();
            expect(clearIdSpy).toHaveBeenCalledWith(swapper);
            done();
        });
    });

    it('clicking on a tile should change its id', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        const addIdSpy = spyOn(component, 'addId').and.callThrough();
        tile.click();
        fixture.whenStable().then(() => {
            expect(addIdSpy).toHaveBeenCalled();
            expect(tile.id).toEqual('swap-selected');
            expect(tile.children[0].className).toEqual('selected');
            done();
        });
    });

    it('right clicking on a tile should change its id', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        const exchangeSpy = spyOn(component, 'addExchangeId').and.callThrough();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clearSelectedSpy = spyOn<any>(component, 'clearSelectedId');
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        fixture.whenStable().then(() => {
            expect(exchangeSpy).toHaveBeenCalled();
            expect(clearSelectedSpy).toHaveBeenCalled();
            expect(tile.id).toEqual('swap-reserve');
            expect(tile.children[0].className).toEqual('selected-reserve');
            expect(component.lettersToExchange.length).toEqual(1);
            expect(component.showButtonsBool).toEqual(true);
            done();
        });
    });

    it('right clicking on a tile with id should remove its id', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        fixture.detectChanges();
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        fixture.whenStable().then(() => {
            expect(tile.id).toEqual('');
            expect(tile.children[0].className).toEqual('tile');
            expect(component.lettersToExchange.length).toEqual(0);
            expect(component.showButtonsBool).toEqual(false);
            done();
        });
    });

    it('clicking the cancel button should call clearExchangeId()', (done) => {
        component.showButtonsBool = true;
        fixture.detectChanges();
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        const cancel = fixture.debugElement.nativeElement.children[1] as HTMLElement;
        const clearSpy = spyOn(component, 'clearExchangeId').and.callThrough();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emptySpy = spyOn<any>(component, 'emptyArray');
        cancel.dispatchEvent(new MouseEvent('mousedown'));
        fixture.whenStable().then(() => {
            expect(clearSpy).toHaveBeenCalled();
            expect(emptySpy).toHaveBeenCalled();
            expect(tile.id).toEqual('');
            expect(tile.children[0].className).toEqual('tile');
            expect(component.showButtonsBool).toEqual(false);
            done();
        });
    });

    it('clicking the exchange button should call exchange()', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        fixture.detectChanges();
        const exchange = fixture.debugElement.nativeElement.children[2] as HTMLElement;
        const exchangeSpy = spyOn(component, 'exchange').and.callThrough();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emptySpy = spyOn<any>(component, 'emptyArray');
        exchange.dispatchEvent(new MouseEvent('mousedown'));
        fixture.whenStable().then(() => {
            expect(exchangeSpy).toHaveBeenCalled();
            expect(emptySpy).toHaveBeenCalled();
            expect(component.showButtonsBool).toEqual(false);
            done();
        });
    });

    it('isAtExtremity() should return Left if element is at the left extremity of the tile holder', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        // eslint-disable-next-line dot-notation
        expect(component['isAtExtremity'](tile)).toEqual('Left');
    });

    it('isAtExtremity() should return Right if element is at the right extremity of the tile holder', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[6] as HTMLElement;
        // eslint-disable-next-line dot-notation
        expect(component['isAtExtremity'](tile)).toEqual('Right');
    });

    it('isAtExtremity() should return empty string if element is not at an extremity of the tile holder', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[3] as HTMLElement;
        // eslint-disable-next-line dot-notation
        expect(component['isAtExtremity'](tile)).toEqual('');
    });

    it('getLettersOnHolder() should return the letters on the tile holder', () => {
        // eslint-disable-next-line dot-notation
        expect(component['getLettersOnHolder']()).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('findLetterIndexes() should return all indexes of a letter if in tile holder', () => {
        // eslint-disable-next-line dot-notation
        expect(component['findLetterIndexes']('A')).toEqual([0]);
    });

    it('findLetterIndexes() should return empty array if letter not on tile holder', () => {
        // eslint-disable-next-line dot-notation
        expect(component['findLetterIndexes']('Z')).toEqual([]);
    });

    it('findLetterIndexes() should call getLettersOnHolder()', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getLetterSpy = spyOn<any>(component, 'getLettersOnHolder').and.callThrough();
        // eslint-disable-next-line dot-notation
        component['findLetterIndexes']('A');
        expect(getLetterSpy).toHaveBeenCalled();
    });

    it('getLastKey() should return the last key that was pressed', (done) => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['getLastKey']()).toBe('a');
            done();
        });
    });

    it('getLastKey() should call shift if the lastKeys array length is bigger than 2', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        const shiftSpy = spyOn(component.lastKeys, 'shift');
        component.buttonDetect(buttonEvent);
        component.buttonDetect(buttonEvent);
        component.buttonDetect(buttonEvent);
        expect(shiftSpy).toHaveBeenCalled();
    });

    it('emptyArray() should empty the lettersToExchange array', (done) => {
        component.lettersToExchange = ['A', 'B', 'C'];
        // eslint-disable-next-line dot-notation
        component['emptyArray']();
        fixture.whenStable().then(() => {
            expect(component.lettersToExchange).toEqual([]);
            done();
        });
    });
});
