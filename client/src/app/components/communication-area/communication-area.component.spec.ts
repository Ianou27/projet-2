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

    it('method subdivisionCommand should return all the message if it doesnt contain pour', () => {
        const message = 'Bonjour à tous';
        const result = component.subdivisionCommand(true, message);
        expect(message).toEqual(result);
    });

    it('method subdivisionCommand with true as beforeFor should return everything before the first pour', () => {
        const message = 'Bonjour à tous pour tout le monde';
        const result = component.subdivisionCommand(true, message);
        expect('Bonjour à tous ').toEqual(result);
    });

    it('method subdivisionCommand with false as beforeFor should return everything after the first pour including pour', () => {
        const message = 'Bonjour à tous pour tout le monde';
        const result = component.subdivisionCommand(false, message);
        expect('pour tout le monde').toEqual(result);
    });
});
