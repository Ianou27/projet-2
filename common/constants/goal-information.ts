import { GoalType } from './goal-type';
export interface GoalInformations {
    name: string;
    title: string;
    value: number;
    isDone: boolean;
    isInGame: boolean;
    type: GoalType;
    description: string;
}
