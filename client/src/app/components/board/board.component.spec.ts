/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatService } from '@app/services/chat.service';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoardComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [ChatService],
        }).compileComponents();
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

    it('method isUpper should return true is a letter is upper case', () => {
        const key = 'A';
        expect(component.isUpper(key)).toBeTrue();
    });

    it('method isUpper should return false is a letter is lower case', () => {
        const key = 'a';
        expect(component.isUpper(key)).toBeFalse();
    });
});
