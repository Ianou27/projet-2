import { GoalType } from './goal-type';
export interface GoalInformations {
    name: string;
    value: number;
    isDone: boolean;
    isInGame: boolean;
    type: GoalType;
}

export const palindrome: GoalInformations {
    'palindrome',
    25,
    
}
