/* eslint-disable max-lines */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';
import { TileHolderComponent } from './tile-holder.component';
// import SpyObj = jasmine.SpyObj;

describe('TileHolderComponent', () => {
    let component: TileHolderComponent;
    let fixture: ComponentFixture<TileHolderComponent>;
    // let tileHolderServiceSpy: SpyObj<TileHolderService>;
    // let chatServiceSpy: SpyObj<ChatService>;
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
        // tileHolderServiceSpy = jasmine.createSpyObj('TileHolderService', {}, { tileHolder: tiles });
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

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const findIndexSpy = spyOn<any>(component, 'findLetterIndexes');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addOnKeySpy = spyOn<any>(component, 'addIdOnKey');
        component.buttonDetect(buttonEvent);
        expect(findIndexSpy).toHaveBeenCalled();
        expect(addOnKeySpy).toHaveBeenCalled();
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

    it('clicking the cancel button should call clearAllIds()', (done) => {
        component.showButtonsBool = true;
        fixture.detectChanges();
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        const cancel = fixture.debugElement.nativeElement.children[1] as HTMLElement;
        const clearSpy = spyOn(component, 'clearAllIds').and.callThrough();
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

    it('Pressing the left arrow key should call handleSide method', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        component.onScroll(new WheelEvent('wheel', { deltaY: -125 }));
        fixture.whenStable().then(() => {
            expect(component.scrollDirection).toEqual(-125);
            done();
        });
    });

    it('Pressing the left arrow key should call handleSide method', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        component.onScroll(new WheelEvent('wheel', { deltaY: 125 }));
        fixture.whenStable().then(() => {
            expect(component.scrollDirection).toEqual(125);
            done();
        });
    });

    it('checkForID() should return true if one tile has an id', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['checkForID']()).toEqual(true);
            done();
        });
    });

    it('checkForId() should return false if tiles have no id', (done) => {
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['checkForID']()).toEqual(false);
            done();
        });
    });

    it('clearAllIds() should remove ids and  reset classes for all tiles', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.dispatchEvent(new MouseEvent('contextmenu'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emptySpy = spyOn<any>(component, 'emptyArray');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkSpy = spyOn<any>(component, 'checkForID');
        // eslint-disable-next-line dot-notation
        component['clearAllIds']();
        fixture.whenStable().then(() => {
            expect(emptySpy).toHaveBeenCalled();
            expect(checkSpy).toHaveBeenCalled();
            expect(tile.id).toEqual('');
            expect(tile.children[0].className).toEqual('tile');
            done();
        });
    });

    it('clearSelectedId() should remove id and reset class', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        // eslint-disable-next-line dot-notation
        component['clearSelectedId']();
        fixture.whenStable().then(() => {
            expect(tile.id).toEqual('');
            expect(tile.children[0].className).toEqual('tile');
            done();
        });
    });

    it('handleSide() should call endToEnd() if tile is at extremity', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const extremitySpy = spyOn<any>(component, 'isAtExtremity').and.callThrough(); // need to call through to get the answer for the if
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const endToEndSpy = spyOn<any>(component, 'endToEnd');
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        // eslint-disable-next-line dot-notation
        component['handleSide']('Left', swapper);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(extremitySpy).toHaveBeenCalled();
            expect(endToEndSpy).toHaveBeenCalled();
            expect(endToEndSpy).toHaveBeenCalledWith(swapper);
            done();
        });
    });

    it('handleSide() should call swap() if tile is not at extremity', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[2] as HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const extremitySpy = spyOn<any>(component, 'isAtExtremity').and.callThrough(); // need to call through to get the answer for the if
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const swapSpy = spyOn<any>(component, 'swap');
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        // eslint-disable-next-line dot-notation
        component['handleSide']('Left', swapper);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(extremitySpy).toHaveBeenCalled();
            expect(swapSpy).toHaveBeenCalled();
            done();
        });
    });

    it('swap() should call insertBefore()', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[2] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        let insertBeforeSpy: jasmine.Spy;
        if (swapper.parentElement) {
            insertBeforeSpy = spyOn(swapper.parentElement, 'insertBefore');
        }
        component.buttonPressed = 'ArrowRight';
        // eslint-disable-next-line dot-notation
        component['swap']();
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(insertBeforeSpy).toHaveBeenCalled();
            done();
        });
    });

    it('swap() should move an element one position to the left', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[1] as HTMLElement;
        tile.click();
        component.buttonPressed = 'ArrowLeft';
        // eslint-disable-next-line dot-notation
        component['swap']();
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['getLettersOnHolder']()).toEqual(['B', 'A', 'C', 'D', 'E', 'F', 'G']);
            done();
        });
    });

    it('swap() should move an element one position to the right', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[1] as HTMLElement;
        tile.click();
        component.buttonPressed = 'ArrowRight';
        // eslint-disable-next-line dot-notation
        component['swap']();
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['getLettersOnHolder']()).toEqual(['A', 'C', 'B', 'D', 'E', 'F', 'G']);
            done();
        });
    });

    it('endToEnd() should call insertBefore()', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[6] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        let insertBeforeSpy: jasmine.Spy;
        if (swapper.parentElement) {
            insertBeforeSpy = spyOn(swapper.parentElement, 'insertBefore');
        }
        component.buttonPressed = 'ArrowRight';
        // eslint-disable-next-line dot-notation
        component['endToEnd'](swapper);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(insertBeforeSpy).toHaveBeenCalled();
            done();
        });
    });

    it('endToEnd() should place element at far right if element was at far left', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        component.buttonPressed = 'ArrowLeft';
        // eslint-disable-next-line dot-notation
        component['endToEnd'](swapper);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['getLettersOnHolder']()).toEqual(['B', 'C', 'D', 'E', 'F', 'G', 'A']);
            done();
        });
    });

    it('endToEnd() should place element at far left if element was at far right', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[6] as HTMLElement;
        tile.click();
        swapper = document.getElementById('swap-selected') as HTMLElement;
        component.buttonPressed = 'ArrowRight';
        // eslint-disable-next-line dot-notation
        component['endToEnd'](swapper);
        fixture.whenStable().then(() => {
            // eslint-disable-next-line dot-notation
            expect(component['getLettersOnHolder']()).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F']);
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
        const getLetterSpy = spyOn<any>(component, 'getLettersOnHolder').and.callThrough(); // need to call through to get the letters for the method
        // eslint-disable-next-line dot-notation
        component['findLetterIndexes']('A');
        expect(getLetterSpy).toHaveBeenCalled();
    });

    it('addIdOnKey() should add an id to the tile associated with letter and call getLastKey', () => {
        component.buttonPressed = 'a';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastKeySpy = spyOn<any>(component, 'getLastKey').and.callFake(() => {
            return 'a';
        });
        const firstTile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        // eslint-disable-next-line dot-notation
        component['addIdOnKey']([0]);
        expect(component.count).toEqual(0);
        expect(lastKeySpy).toHaveBeenCalled();
        expect(firstTile.id).toEqual('swap-selected');
        expect(firstTile.children[0].className).toEqual('selected');
    });

    it('addIdOnKey() should increment the count, add an id to first occurrence of a tile', () => {
        tiles = [];
        const letters = ['A', 'A', 'A', 'D', 'E', 'F', 'G'];
        component.buttonPressed = 'a';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(component, 'getLastKey').and.callFake(() => {
            return 'a';
        });
        for (const letter of letters) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = letter;
            tile.value = letterValue[letter];
            tiles.push(tile);
        }
        const firstTile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        // eslint-disable-next-line dot-notation
        component['addIdOnKey']([0, 1, 2]);
        expect(component.count).toEqual(1);
        expect(firstTile.id).toEqual('swap-selected');
        expect(firstTile.children[0].className).toEqual('selected');
    });

    it('addIdOnKey() should increment the count, add an id to first occurrence of a tile and call getLastKey', () => {
        tiles = [];
        const letters = ['A', 'A', 'A', 'D', 'E', 'F', 'G'];
        component.buttonPressed = 'a';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(component, 'getLastKey').and.callFake(() => {
            return 'z';
        });
        for (const letter of letters) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = letter;
            tile.value = letterValue[letter];
            tiles.push(tile);
        }
        const firstTile = fixture.debugElement.nativeElement.children[0].children[0] as HTMLElement;
        // eslint-disable-next-line dot-notation
        component['addIdOnKey']([0, 1, 2]);
        expect(component.count).toEqual(1);
        expect(firstTile.id).toEqual('swap-selected');
        expect(firstTile.children[0].className).toEqual('selected');
    });

    it('getLastKey() should return the last key that was pressed', () => {
        component.lastKeys = ['a'];
        // eslint-disable-next-line dot-notation
        expect(component['getLastKey']()).toBe('a');
    });

    it('getLastKey() should call shift if the lastKeys array length is bigger than 2', () => {
        component.lastKeys = ['a', 'a', 'a'];
        const shiftSpy = spyOn(component.lastKeys, 'shift');
        // eslint-disable-next-line dot-notation
        component['getLastKey']();
        expect(shiftSpy).toHaveBeenCalled();
    });

    it('emptyArray() should empty the lettersToExchange array', () => {
        component.lettersToExchange = ['A', 'B', 'C'];
        // eslint-disable-next-line dot-notation
        component['emptyArray']();
        expect(component.lettersToExchange).toEqual([]);
    });
});
