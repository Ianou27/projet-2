import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TileComponent } from '@app/components/tile/tile.component';
import { BestScoreComponent } from '@app/pages/best-score/best-score.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { CommunicationService } from '@app/services/communication/communication.service';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('ExampleService', ['basicGet', 'basicPost']);
        communicationServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        communicationServiceSpy.basicPost.and.returnValue(of());

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent, TileComponent],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy },
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {
                            return;
                        },
                        closeAll: () => {
                            return;
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set value after view checked', () => {
        const title = fixture.debugElement.nativeElement.getElementsByClassName('rectangle')[0];
        const letter = title.children[0].children[0].children[0] as HTMLElement;
        const score = title.children[0].children[0].children[1] as HTMLElement;
        expect(title.children[0].children[0].children[0].id).toEqual('letterTitle');
        expect(letter.style.fontSize).toEqual('40px');
        expect(score.style.fontSize).toEqual('20px');
    });

    it('openDialog should call open on the dialog and disable the option to click outside to close', () => {
        const dialogSpy = spyOn(component.dialog, 'open');
        component.openDialog();
        expect(dialogSpy).toHaveBeenCalledWith(BestScoreComponent, { width: '800px' });
    });
});
