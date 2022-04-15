import { GoalInformations } from './goal-information';
import { GoalType } from './goal-type';

export interface Goals {
    [goal: string]: GoalInformations;
}

export const allGoals: Goals = {
    palindrome: {
        name: 'palindrome',
        title: 'Palindrome',
        value: 25,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former un palindrome (Ex: kayak)',
    },
    tripleE: {
        name: 'tripleE',
        title: 'Triple E',
        value: 30,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former mot contenant 3 E',
    },
    scrabble: {
        name: 'scrabble',
        title: 'Scrabble!',
        value: 50,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former le mot scrabble',
    },
    eightLetters: {
        name: 'eightLetters',
        title: 'Mot de 8 lettres',
        value: 25,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former un mot de 8 lettres',
    },
    specialTile: {
        name: 'specialTile',
        title: 'Case spéciale',
        value: 10,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Placer une lettre sur la case B4',
    },
    threeWords: {
        name: 'threeWords',
        title: '3 mots',
        value: 40,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former 3 mots ou plus',
    },
    twoStars: {
        name: 'twoStars',
        title: 'Lettres étoile',
        value: 15,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: "Former un mot avec deux lettres étoiles (Vous n'êtes pas obligé de possédé les deux)",
    },
    twoTenPointsLetters: {
        name: 'twoTenPointsLetters',
        title: 'Lettres de 10',
        value: 75,
        isDone: false,
        isInGame: false,
        type: GoalType.Public,
        description: 'Former un mot avec deux lettres valant 10 points.',
    },
};
