import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalType } from '../../../../../common/constants/goal-type';
import { allGoals } from './../../../../../common/constants/goals';
import { GoalsComponent } from './goals.component';

describe('GoalsComponent', () => {
    let component: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GoalsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GoalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('method getType should return Public if goalType is public', () => {
        expect(component.getType(allGoals.palindrome)).toBe('Public');
    });

    it('method getType should return privé if goalType is private player 1 or 2', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        goals.palindrome.type = GoalType.PrivatePlayer1;
        expect(component.getType(goals.palindrome)).toBe('Privé');
    });
});
