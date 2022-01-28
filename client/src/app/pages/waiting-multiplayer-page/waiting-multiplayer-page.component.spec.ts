import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingMultiplayerPageComponent } from './waiting-multiplayer-page.component';

describe('WaitingMultiplayerPageComponent', () => {
  let component: WaitingMultiplayerPageComponent;
  let fixture: ComponentFixture<WaitingMultiplayerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingMultiplayerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingMultiplayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
