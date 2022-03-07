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
});
