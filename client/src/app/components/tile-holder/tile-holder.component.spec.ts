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
        const letters = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
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
            declarations: [TileHolderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            // providers: [{ provide: TileHolderService, useValue: tileHolderServiceSpy }],
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

    it('getLastKey() should get last two keys that were pressed', (done) => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        // eslint-disable-next-line dot-notation
        component['getLastKey']();
        fixture.whenStable().then(() => {
            expect(component.lastKeys).toEqual(['a']);
            done();
        });
    });
});
