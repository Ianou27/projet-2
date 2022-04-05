import {
    EIGHT_LETTERS_VALIDATION,
    LETTER_VALUE_TEN,
    SPECIAL_TILE_X,
    SPECIAL_TILE_Y,
    THREE_LETTERS_OR_WORDS_VALIDATION,
    TWO_LETTERS_OR_WORDS_VALIDATION,
} from '@common/constants/general-constants';
import { GoalType } from '@common/constants/goal-type';
import { allGoals } from '@common/constants/goals';
import { Tile } from '@common/tile/Tile';
import { Game } from './../game/game';

export class Goal {
    static validationGoal(words: Tile[][], game: Game): number {
        let bonusPoints = 0;
        for (const goal in game.goals) {
            if (!this.turnVerification(goal, game) || !game.goals[goal].isInGame || game.goals[goal].isDone) continue;
            switch (game.goals[goal].name) {
                case 'tripleE': {
                    bonusPoints += this.tripleE(words, game);
                    break;
                }
                case 'palindrome': {
                    bonusPoints += this.isPalindrome(words, game);
                    break;
                }
                case 'scrabble': {
                    bonusPoints += this.hasWordScrabble(words, game);
                    break;
                }
                case 'eightLetters': {
                    bonusPoints += this.hasEightLetters(words, game);
                    break;
                }
                case 'specialTile': {
                    bonusPoints += this.specialTile(words, game);
                    break;
                }
                case 'threeWords': {
                    bonusPoints += this.threeWords(words, game);
                    break;
                }
                case 'twoStars': {
                    bonusPoints += this.hasTwoStars(words, game);
                    break;
                }
                case 'twoTenPointsLetters': {
                    bonusPoints += this.twoTenPointsLetters(words, game);
                    break;
                }
            }
        }
        return bonusPoints;
    }

    static tripleE(words: Tile[][], game: Game): number {
        let eCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.letter.toUpperCase() === 'E') {
                    eCount++;
                }
                if (eCount === THREE_LETTERS_OR_WORDS_VALIDATION) {
                    game.goals.tripleE.isDone = true;
                    return allGoals.tripleE.value;
                }
            }
            eCount = 0;
        }
        return 0;
    }

    static specialTile(words: Tile[][], game: Game): number {
        for (const word of words) {
            for (const tile of word) {
                if (tile.positionX === SPECIAL_TILE_X && tile.positionY === SPECIAL_TILE_Y) {
                    game.goals.specialTile.isDone = true;
                    return allGoals.specialTile.value;
                }
            }
        }
        return 0;
    }

    static threeWords(words: Tile[][], game: Game): number {
        if (words.length >= THREE_LETTERS_OR_WORDS_VALIDATION) {
            game.goals.threeWords.isDone = true;
            return allGoals.threeWords.value;
        }
        return 0;
    }

    static isPalindrome(words: Tile[][], game: Game): number {
        let i = 0;
        let j = words[0].length - 1;
        for (const word of words) {
            while (i <= j) {
                if (word[i].letter !== word[j].letter) {
                    return 0;
                }
                i++;
                j--;
            }
        }
        game.goals.palindrome.isDone = true;
        return allGoals.palindrome.value;
    }

    static hasEightLetters(words: Tile[][], game: Game): number {
        for (const word of words) {
            if (word.length >= EIGHT_LETTERS_VALIDATION) {
                game.goals.eightLetters.isDone = true;
                return allGoals.eightLetters.value;
            }
        }
        return 0;
    }

    static hasTwoStars(words: Tile[][], game: Game): number {
        let starCount = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === 0) starCount++;
                if (starCount === TWO_LETTERS_OR_WORDS_VALIDATION) {
                    game.goals.twoStars.isDone = true;
                    return allGoals.twoStars.value;
                }
            }
            starCount = 0;
        }
        return 0;
    }

    static twoTenPointsLetters(words: Tile[][], game: Game): number {
        let counter = 0;
        for (const word of words) {
            for (const tile of word) {
                if (tile.value === LETTER_VALUE_TEN) {
                    counter++;
                }
                if (counter === TWO_LETTERS_OR_WORDS_VALIDATION) {
                    game.goals.twoTenPointsLetters.isDone = true;
                    return allGoals.twoTenPointsLetters.value;
                }
            }
            counter = 0;
        }

        return 0;
    }

    static hasWordScrabble(words: Tile[][], game: Game): number {
        const wordScrabble = ['S', 'C', 'R', 'A', 'B', 'B', 'L', 'E'];
        let counter = 0;
        for (const word of words) {
            for (let i = 0; i < wordScrabble.length; i++) {
                if (word[i].letter === wordScrabble[i]) {
                    counter++;
                    if (counter === wordScrabble.length - 1) {
                        game.goals.scrabble.isDone = true;
                        return allGoals.scrabble.value;
                    }
                    continue;
                }
                break;
            }
            counter = 0;
        }

        return 0;
    }

    static turnVerification(goal: string, game: Game): boolean {
        if (game.goals[goal].type === GoalType.Public) return true;
        else if (game.goals[goal].type === GoalType.PrivatePlayer1 && game.playerTurn() === game.player1) return true;
        else if (game.goals[goal].type === GoalType.PrivatePlayer2 && game.playerTurn() === game.player2) return true;
        return false;
    }
}
