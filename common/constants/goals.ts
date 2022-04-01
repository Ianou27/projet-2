import { GoalInformations } from './goal-information';
import { GoalType } from './goal-type';

export interface Goals {
    [goal: string]: GoalInformations;
}

export const allGoals: Goals = {
    palindrome: {
        name: 'palindrome',
        value: 25,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    tripleE: {
        name: 'tripleE',
        value: 30,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    scrabble: {
        name: 'scrabble',
        value: 50,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    eightLetters: {
        name: 'eightLetters',
        value: 25,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    specialTile: {
        name: 'specialTile',
        value: 10,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    threeWords: {
        name: 'threeWords',
        value: 40,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    twoStars: {
        name: 'twoStars',
        value: 15,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
    twoTenPointsLetters: {
        name: 'twoStars',
        value: 75,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
    },
};
