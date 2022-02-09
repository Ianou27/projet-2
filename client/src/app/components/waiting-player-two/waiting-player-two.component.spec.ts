import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPlayerTwoComponent } from './waiting-player-two.component';

describe('WaitingPlayerTwoComponent', () => {
  let component: WaitingPlayerTwoComponent;
  let fixture: ComponentFixture<WaitingPlayerTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingPlayerTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPlayerTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
