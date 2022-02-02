import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';


describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let submitEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitEl = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disable set to true should disabled the button ', () => {
    component.disable = "true";
    fixture.detectChanges();
    expect(submitEl.nativeElement.querySelector('button').disabled).toBeTruthy();
  });

  it('disable not set to a value should not disabled the button ', () => {
    fixture.detectChanges();
    expect(submitEl.nativeElement.querySelector('button').disabled).toBeFalsy();
  });

});
