import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { CommunicationAreaComponent } from './communication-area.component';

describe('CommunicationAreaComponent', () => {
    let component: CommunicationAreaComponent;
    let fixture: ComponentFixture<CommunicationAreaComponent>;
    let clientSocketHandlerSpy: jasmine.SpyObj<ClientSocketHandler>;

    beforeEach(async () => {
        clientSocketHandlerSpy = jasmine.createSpyObj('ChatService', ['init']);
        await TestBed.configureTestingModule({
            declarations: [CommunicationAreaComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ClientSocketHandler, useValue: clientSocketHandlerSpy }],
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
        expect(clientSocketHandlerSpy.init).toHaveBeenCalledTimes(1);
    });
});
