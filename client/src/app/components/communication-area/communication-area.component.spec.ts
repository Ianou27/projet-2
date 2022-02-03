import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationAreaComponent } from './communication-area.component';

describe('CommunicationAreaComponent', () => {
    let component: CommunicationAreaComponent;
    let fixture: ComponentFixture<CommunicationAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommunicationAreaComponent],
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
});
