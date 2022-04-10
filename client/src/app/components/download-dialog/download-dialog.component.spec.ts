import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { DownloadDialogComponent } from './download-dialog.component';
import SpyObj = jasmine.SpyObj;

describe('DownloadDialogComponent', () => {
    let component: DownloadDialogComponent;
    let fixture: ComponentFixture<DownloadDialogComponent>;
    let clientSocketHandlerSpy: SpyObj<ClientSocketHandler>;

    beforeEach(() => {
        clientSocketHandlerSpy = jasmine.createSpyObj('ClientSocketHandler', [], {
            dictionaryToDownload: '{"title":"test","description":"test","words":["aa", "aalenien"]}',
        });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DownloadDialogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ClientSocketHandler, useValue: clientSocketHandlerSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should generate a uri', () => {
        component.generateDownloadJsonUri();
        expect(component.downloadJsonHref).toBeDefined();
    });
});
