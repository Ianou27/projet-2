/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardService } from '@app/services/board.service';
import { ChatService } from '@app/services/chat.service';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';
import { TileComponent } from './../tile/tile.component';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    // let boardServiceSpy: jasmine.SpyObj<BoardService>;
    /// let chatServiceSpy: jasmine.SpyObj<ChatService>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoardComponent, TileComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [ChatService, BoardService],
        }).compileComponents();
    });

    beforeEach(() => {
        // boardServiceSpy = jasmine.createSpyObj('BoardService', ['build'], ['board']);
        // chatServiceSpy = jasmine.createSpyObj('ChatService', ['tileHolderService'], ['tileHolderService.letterInTileHolder']);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('method keyHandler should call clearAll method when event key is Escape', () => {
        const expectedKey = 'Escape';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        const spy = spyOn<any>(component, 'clearAll').and.stub();
        component.keyHandler(buttonEvent);

        expect(spy).toHaveBeenCalled();
    });

    it('method keyHandler should call clearAll method when event key is Enter', () => {
        const expectedKey = 'Enter';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        const spy = spyOn<any>(component, 'placeWord').and.stub();
        component.keyHandler(buttonEvent);

        expect(spy).toHaveBeenCalled();
    });

    it('method keyHandler should call removeLetter method when event key is Backspace', () => {
        const expectedKey = 'Backspace';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        const spy = spyOn<any>(component, 'removeLetter').and.stub();
        component.keyHandler(buttonEvent);

        expect(spy).toHaveBeenCalled();
    });

    it('method keyHandler should call clearAll method when event key is alphabet', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        const spy = spyOn<any>(component, 'placeLetter').and.stub();
        component.keyHandler(buttonEvent);

        expect(spy).toHaveBeenCalled();
    });

    it('clicking on a tile should call verificationSelection method', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        const idSpy = spyOn<any>(component, 'verificationSelection').and.stub();
        tile.click();
        fixture.whenStable().then(() => {
            expect(idSpy).toHaveBeenCalled();
            done();
        });
    });

    it('clicking on a tile should change id and class', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        fixture.whenStable().then(() => {
            expect(tile.classList.contains('writing')).toBeTrue();
            expect(tile.id).toEqual('currentSelection');
            expect(tile.children[0].className).toEqual('tileEmptyHorizontal');
            expect(tile.children[0].id).toEqual('arrow-right');
            done();
        });
    });

    it('clicking on a tile twice should change class to tileEmptyVertical', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        tile.click();
        fixture.whenStable().then(() => {
            expect(tile.children[0].className).toEqual('tileEmptyVertical');
            expect(tile.children[0].id).toEqual('arrow-down');
            done();
        });
    });

    it('clicking on a tile three times should change class to tileEmptyHorizontal', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        tile.click();
        tile.click();
        fixture.whenStable().then(() => {
            expect(tile.children[0].className).toEqual('tileEmptyHorizontal');
            expect(tile.children[0].id).toEqual('arrow-right');
            done();
        });
    });

    it('clicking on a tile three times should reset last tile and set current tile', (done) => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        const tile2 = fixture.debugElement.nativeElement.children[0].children[0].children[1].children[0] as HTMLElement;
        tile.click();
        tile2.click();
        fixture.whenStable().then(() => {
            expect(tile.children[0].className).toEqual('tileEmpty');
            expect(tile.children[0].id).toEqual('');
            expect(tile2.id).toEqual('currentSelection');
            expect(tile2.className).toEqual('writing');
            done();
        });
    });

    it('method placeLetter should return if key is not a letter', () => {
        const key = '3';
        const spy = spyOn<any>(component, 'inTileHolder').and.callThrough();
        component.placeLetter(key);
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('method placeLetter should call nextTile', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        const tileInTileHolder = new Tile(CaseProperty.Normal, 0, 0);
        tileInTileHolder.letter = 'A';
        tileInTileHolder.value = letterValue[tileInTileHolder.letter];
        component.chatService.tileHolderService.tileHolder = [tileInTileHolder];
        const key = 'a';
        const spy = spyOn<any>(component, 'nextTile').and.stub();
        component.placeLetter(key);
        expect(spy).toHaveBeenCalled();
    });

    it('method placeLetter should set the current tile class to written', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        const tileInTileHolder = new Tile(CaseProperty.Normal, 0, 0);
        tileInTileHolder.letter = 'A';
        tileInTileHolder.value = letterValue[tileInTileHolder.letter];
        component.chatService.tileHolderService.tileHolder = [tileInTileHolder];
        const key = 'a';
        component.placeLetter(key);
        expect(tile.className).toEqual('written');
    });

    it('method placeLetter should add the letter to the letters placed', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        const tileInTileHolder = new Tile(CaseProperty.Normal, 0, 0);
        tileInTileHolder.letter = 'A';
        tileInTileHolder.value = letterValue[tileInTileHolder.letter];
        component.chatService.tileHolderService.tileHolder = [tileInTileHolder];
        const key = 'a';
        expect(component.letterPlaced.length).toEqual(0);
        component.placeLetter(key);
        expect(component.letterPlaced.length).toEqual(1);
    });

    it('method placeLetter should add * if the letter is upper case to the letters placed', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        tile.click();
        const tileInTileHolder = new Tile(CaseProperty.Normal, 0, 0);
        tileInTileHolder.letter = '*';
        tileInTileHolder.value = letterValue[tileInTileHolder.letter];
        component.chatService.tileHolderService.tileHolder = [tileInTileHolder];
        const key = 'A';
        expect(component.letterPlaced.length).toEqual(0);
        component.placeLetter(key);
        expect(component.letterPlaced.length).toEqual(1);
        expect(component.letterPlaced[0]).toEqual('*');
    });

    it('method nextTile should set the next element writing class when orientation is h', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        const nextTile = fixture.debugElement.nativeElement.children[0].children[1].children[0].children[0] as HTMLElement;
        tile.click();
        component.nextTile(tile);
        expect(nextTile.className).toEqual('writing');
    });

    it('method nextTile should set the next element writing class when orientation is v', () => {
        const tile = fixture.debugElement.nativeElement.children[0].children[0].children[0].children[0] as HTMLElement;
        const nextTile = fixture.debugElement.nativeElement.children[0].children[0].children[1].children[0] as HTMLElement;
        tile.click();
        tile.click();
        component.nextTile(tile);
        expect(nextTile.className).toEqual('writing');
    });

    // it('method remove letter should do nothing if no letter was placed')
});
