import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatService } from '@app/services/chat.service';
import { CommunicationAreaComponent } from './communication-area.component';

describe('CommunicationAreaComponent', () => {
    let component: CommunicationAreaComponent;
    let fixture: ComponentFixture<CommunicationAreaComponent>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;

    beforeEach(async () => {
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['init']);
        await TestBed.configureTestingModule({
            declarations: [CommunicationAreaComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ChatService, useValue: chatServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunicationAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should call init', () => {
        expect(chatServiceSpy.init).toHaveBeenCalledTimes(1);
    });
});
