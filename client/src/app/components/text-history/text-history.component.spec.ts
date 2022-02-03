import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextHistoryComponent } from './text-history.component';

describe('TextHistoryComponent', () => {
  let component: TextHistoryComponent;
  let fixture: ComponentFixture<TextHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
