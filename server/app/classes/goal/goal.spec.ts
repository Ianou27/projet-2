/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable guard-for-in */
/* eslint-disable max-lines */
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { SPECIAL_TILE_X, SPECIAL_TILE_Y } from '@common/constants/general-constants';
import { GoalType } from '@common/constants/goal-type';
import { allGoals } from '@common/constants/goals';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { Goal } from './goal';

describe('Goal', () => {
    let words: Tile[][];
    let word: Tile[];
    let game: Game;
    beforeEach(() => {
        words = [];
        word = [];
        game = new Game();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('method tripleE should return the right value if one word contains 3 e', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        game.goals = JSON.parse(JSON.stringify(allGoals));
        words.push(word);
        expect(Goal.tripleE(words, game)).equal(allGoals.tripleE.value);
    });

    it('method tripleE should return 0 if no word contains three e', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        game.goals = JSON.parse(JSON.stringify(allGoals));
        words.push(word);
        expect(Goal.tripleE(words, game)).equal(0);
    });

    it('method specialTile should return the right value if word is placed on B4', () => {
        const tile = new Tile(CaseProperty.Normal, SPECIAL_TILE_X, SPECIAL_TILE_Y);
        tile.letter = 'A';
        tile.value = letterValue[tile.letter];
        word.push(tile);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        words.push(word);
        expect(Goal.specialTile(words, game)).equal(allGoals.specialTile.value);
    });

    it('method specialTile should return 0 if word is placed on B4', () => {
        const tile = new Tile(CaseProperty.Normal, SPECIAL_TILE_Y, SPECIAL_TILE_X);
        tile.letter = 'A';
        tile.value = letterValue[tile.letter];
        word.push(tile);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        words.push(word);
        expect(Goal.specialTile(words, game)).equal(0);
    });

    it('method threeWords should return the right value if there is at least three words', () => {
        for (let i = 0; i < 4; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
            words.push(word);
        }
        game.goals = JSON.parse(JSON.stringify(allGoals));
        expect(Goal.threeWords(words, game)).equal(allGoals.threeWords.value);
    });

    it('method threeWords should return 0 if there is at least three words', () => {
        for (let i = 0; i < 2; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
            words.push(word);
            word = [];
        }
        game.goals = JSON.parse(JSON.stringify(allGoals));
        expect(Goal.threeWords(words, game)).equal(0);
    });

    it('method isPalindrome should return the right value if it is palindrome', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        game.goals = JSON.parse(JSON.stringify(allGoals));
        words.push(word);
        expect(Goal.isPalindrome(words, game)).equal(allGoals.palindrome.value);
    });

    it('method isPalindrome should return 0 if it is palindrome', () => {
        for (let i = 0; i < 2; i++) {
            word.push(new Tile(CaseProperty.Normal, 0, 0));
        }
        word[0].letter = 'A';
        word[0].value = letterValue[word[0].letter];
        word[1].letter = 'E';
        word[1].value = letterValue[word[1].letter];
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        expect(Goal.isPalindrome(words, game)).equal(0);
    });

    it('method hasWordScrabble should return 0 if no words is the word SCRABBLE', () => {
        const word1 = ['B', 'E', 'A', 'U'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = letterValue[word1[i]];
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.hasWordScrabble(words, game);
        expect(result).equal(0);
    });

    it('method hasWordScrabble should return the right value if at least one word is SCRABBLE', () => {
        const word1 = ['S', 'C', 'R', 'A', 'B', 'B', 'L', 'E'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = letterValue[word1[i]];
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.hasWordScrabble(words, game);
        expect(result).equal(allGoals.scrabble.value);
    });

    it('method twoTenPointsLetters should return 0 if no word contains two 10 points letters', () => {
        const word1 = ['B', 'E', 'A', 'U'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = letterValue[word1[i]];
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.twoTenPointsLetters(words, game);
        expect(result).equal(0);
    });

    it('method twoTenPointsLetters should return the right value if at least one word contains two 10 points letters', () => {
        const word1 = ['K', 'A', 'Y', 'A', 'K'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = letterValue[word1[i]];
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.twoTenPointsLetters(words, game);
        expect(result).equal(allGoals.twoTenPointsLetters.value);
    });

    it('method hasTwoStars should return 0 if no word contains two 0 points letter star', () => {
        const word1 = ['B', 'E', 'A', 'U'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = letterValue[word1[i]];
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.hasTwoStars(words, game);
        expect(result).equal(0);
    });

    it('method hasTwoStars should return true if at least one word contains two 0 points letter (star)', () => {
        const word1 = ['L', 'E'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = 0;
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.hasTwoStars(words, game);
        expect(result).equal(allGoals.twoStars.value);
    });

    it('method hasEightLetters should return 0 if no word contains 8 or more letters', () => {
        const word1 = ['B', 'E', 'A', 'U'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = 0;
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = JSON.parse(JSON.stringify(allGoals));
        const result = Goal.hasEightLetters(words, game);
        expect(result).equal(0);
    });

    it('method hasEightLetters should return the right value if at least one word contains 8 or more letters', () => {
        const word1 = ['H', 'E', 'L', 'I', 'C', 'O', 'P', 'T', 'E', 'R', 'E'];
        const word2 = ['F', 'A', 'I', 'T'];
        for (let i = 0; i < word1.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word1[i];
            tile.value = 0;
            word.push(tile);
        }
        words.push(word);
        word = [];
        for (let i = 0; i < word2.length; i++) {
            const tile = new Tile(CaseProperty.Normal, i, i);
            tile.letter = word2[i];
            tile.value = letterValue[word2[i]];
            word.push(tile);
        }
        words.push(word);
        game.goals = allGoals;
        const result = Goal.hasEightLetters(words, game);
        expect(result).equal(allGoals.eightLetters.value);
    });

    it('method validationGoal should call functions when goal is in game and not done', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        game.goals = goals;
        for (const goal in game.goals) {
            game.goals[goal].isInGame = true;
            game.goals[goal].isDone = false;
        }
        const spyTripleE = sinon.spy(Goal, 'tripleE');
        const spyEightLetters = sinon.spy(Goal, 'hasEightLetters');
        const spyTwoStars = sinon.spy(Goal, 'hasTwoStars');
        const spyScrabble = sinon.spy(Goal, 'hasWordScrabble');
        const spyPalindrome = sinon.spy(Goal, 'isPalindrome');
        const spySpecialTile = sinon.spy(Goal, 'specialTile');
        const spyThreeWords = sinon.spy(Goal, 'threeWords');
        const spyTwoTenPoints = sinon.spy(Goal, 'twoTenPointsLetters');
        Goal.validationGoal(words, game);
        expect(spySpecialTile.called);
        expect(spyTripleE.called);
        expect(spyTwoStars.called);
        expect(spyScrabble.called);
        expect(spyPalindrome.called);
        expect(spyThreeWords.called);
        expect(spyTwoTenPoints.called);
        expect(spySpecialTile.called);
        expect(spyEightLetters.called);
    });

    it('method validationGoal should not call functions when turnVerification returns false', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        game.goals = goals;
        for (const goal in game.goals) {
            game.goals[goal].isInGame = true;
        }
        sinon.replace(Goal, 'turnVerification', () => {
            return false;
        });
        const spyTripleE = sinon.stub(Goal, 'tripleE');
        const spyEightLetters = sinon.stub(Goal, 'hasEightLetters');
        const spyTwoStars = sinon.stub(Goal, 'hasTwoStars');
        const spyScrabble = sinon.stub(Goal, 'hasWordScrabble');
        const spyPalindrome = sinon.stub(Goal, 'isPalindrome');
        const spySpecialTile = sinon.stub(Goal, 'specialTile');
        const spyThreeWords = sinon.stub(Goal, 'threeWords');
        const spyTwoTenPoints = sinon.stub(Goal, 'twoTenPointsLetters');
        Goal.validationGoal(words, game);
        expect(!spySpecialTile.called);
        expect(!spyTripleE.called);
        expect(!spyTwoStars.called);
        expect(!spyScrabble.called);
        expect(!spyPalindrome.called);
        expect(!spyThreeWords.called);
        expect(!spyTwoTenPoints.called);
        expect(!spySpecialTile.called);
        expect(!spyEightLetters.called);
    });

    it('method validationGoal should not call functions when goal is not in game', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        game.goals = goals;
        for (const goal in game.goals) {
            game.goals[goal].isInGame = false;
        }
        sinon.replace(Goal, 'turnVerification', () => {
            return true;
        });
        const spyTripleE = sinon.stub(Goal, 'tripleE');
        const spyEightLetters = sinon.stub(Goal, 'hasEightLetters');
        const spyTwoStars = sinon.stub(Goal, 'hasTwoStars');
        const spyScrabble = sinon.stub(Goal, 'hasWordScrabble');
        const spyPalindrome = sinon.stub(Goal, 'isPalindrome');
        const spySpecialTile = sinon.stub(Goal, 'specialTile');
        const spyThreeWords = sinon.stub(Goal, 'threeWords');
        const spyTwoTenPoints = sinon.stub(Goal, 'twoTenPointsLetters');
        Goal.validationGoal(words, game);
        expect(!spySpecialTile.called);
        expect(!spyTripleE.called);
        expect(!spyTwoStars.called);
        expect(!spyScrabble.called);
        expect(!spyPalindrome.called);
        expect(!spyThreeWords.called);
        expect(!spyTwoTenPoints.called);
        expect(!spySpecialTile.called);
        expect(!spyEightLetters.called);
    });

    it('method validationGoal should not call functions when goal is Done', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        game.goals = goals;
        for (const goal in game.goals) {
            game.goals[goal].isInGame = true;
            game.goals[goal].isDone = true;
        }
        sinon.replace(Goal, 'turnVerification', () => {
            return true;
        });
        const spyTripleE = sinon.stub(Goal, 'tripleE');
        const spyEightLetters = sinon.stub(Goal, 'hasEightLetters');
        const spyTwoStars = sinon.stub(Goal, 'hasTwoStars');
        const spyScrabble = sinon.stub(Goal, 'hasWordScrabble');
        const spyPalindrome = sinon.stub(Goal, 'isPalindrome');
        const spySpecialTile = sinon.stub(Goal, 'specialTile');
        const spyThreeWords = sinon.stub(Goal, 'threeWords');
        const spyTwoTenPoints = sinon.stub(Goal, 'twoTenPointsLetters');
        Goal.validationGoal(words, game);
        expect(!spySpecialTile.called);
        expect(!spyTripleE.called);
        expect(!spyTwoStars.called);
        expect(!spyScrabble.called);
        expect(!spyPalindrome.called);
        expect(!spyThreeWords.called);
        expect(!spyTwoTenPoints.called);
        expect(!spySpecialTile.called);
        expect(!spyEightLetters.called);
    });

    it('method turnVerification should return true if goal is public', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        game.goals = goals;
        for (const goal in game.goals) {
            game.goals[goal].isInGame = true;
        }
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'aaa', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'bbb', id: '2', room: 'room1' });
        expect(Goal.turnVerification('palindrome', game)).to.equal(true);
    });

    it('method turnVerification should return true if goal is privatePlayer1 and player turn is player 1', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        game.goals = goals;
        game.goals.palindrome.type = GoalType.PrivatePlayer1;
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'aaa', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'bbb', id: '2', room: 'room1' });
        expect(Goal.turnVerification('palindrome', game)).to.equal(true);
    });

    it('method turnVerification should return true if goal is privatePlayer2 and player turn is player 2', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        game.goals = goals;
        game.goals.palindrome.type = GoalType.PrivatePlayer2;
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player1', { username: 'aaa', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player2', { username: 'bbb', id: '2', room: 'room1' });
        expect(Goal.turnVerification('palindrome', game)).to.equal(true);
    });

    it('method turnVerification should return false if goal is private and it is not the players turn', () => {
        const goals = JSON.parse(JSON.stringify(allGoals));
        game.goals = goals;
        game.goals.palindrome.type = GoalType.PrivatePlayer2;
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'aaa', id: '1', room: 'room1' });
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'bbb', id: '2', room: 'room1' });
        expect(Goal.turnVerification('palindrome', game)).to.equal(false);
    });
});
