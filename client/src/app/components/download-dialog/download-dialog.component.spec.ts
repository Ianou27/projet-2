import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadDialogComponent } from './download-dialog.component';

describe('DownloadDialogComponent', () => {
    let component: DownloadDialogComponent;
    let fixture: ComponentFixture<DownloadDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DownloadDialogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
});
