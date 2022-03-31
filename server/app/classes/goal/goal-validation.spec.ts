import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Goal } from './goal-validation';

describe('Goal', () => {
    let words: Tile[][];
    let word: Tile[];
    beforeEach(() => {
        words = [];
        word = [];
    });

    it('method tripleE should return true if one word contains 3 e', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'E';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        expect(Goal.tripleE(words)).equal(true);
    });

    it('method tripleE should return false if no word contains three e', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        expect(Goal.tripleE(words)).equal(false);
    });

    it('method threeWords should return true if there is at least three words', () => {
        for (let i = 0; i < 4; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
            words.push(word);
        }
        expect(Goal.threeWords(words)).equal(true);
    });

    it('method threeWords should return true if there is at least three words', () => {
        for (let i = 0; i < 2; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
            words.push(word);
            word = [];
        }
        expect(Goal.threeWords(words)).equal(false);
    });

    it('method isPalindrome should return true if it is palindrome', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        expect(Goal.isPalindrome(words)).equal(true);
    });

    it('method isPalindrome should return true if it is palindrome', () => {
        for (let i = 0; i < 3; i++) {
            const tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            word.push(tile);
        }
        words.push(word);
        expect(Goal.isPalindrome(words)).equal(true);
    });

    it('method isPalindrome should return true if it is palindrome', () => {
        for (let i = 0; i < 2; i++) {
            word.push(new Tile(CaseProperty.Normal, 0, 0));
        }
        word[0].letter = 'A';
        word[0].value = letterValue[word[0].letter];
        word[1].letter = 'E';
        word[1].value = letterValue[word[1].letter];
        words.push(word);
        expect(Goal.isPalindrome(words)).equal(false);
    });

    it('method hasWordScrabble should return false if no words is the word SCRABBLE', () => {
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
        const result = Goal.hasWordScrabble(words);
        expect(result).equal(false);
    });

    it('method hasWordScrabble should return true if at least one word is SCRABBLE', () => {
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
        const result = Goal.hasWordScrabble(words);
        expect(result).equal(true);
    });

    it('method twoTenPointsLetters should return false if no word contains two 10 points letters', () => {
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
        const result = Goal.twoTenPointsLetters(words);
        expect(result).equal(false);
    });

    it('method twoTenPointsLetters should return true if at least one word contains two 10 points letters', () => {
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
        const result = Goal.twoTenPointsLetters(words);
        expect(result).equal(true);
    });

    it('method hasTwoStars should return false if no word contains two 0 points letter (star)', () => {
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
        const result = Goal.hasTwoStars(words);
        expect(result).equal(false);
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
        const result = Goal.hasTwoStars(words);
        expect(result).equal(true);
    });

    it('method hasEightLetters should return false if no word contains 8 or more letters', () => {
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
        const result = Goal.hasEightLetters(words);
        expect(result).equal(false);
    });

    it('method hasEightLetters should return true if at least one word contains 8 or more letters', () => {
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
        const result = Goal.hasEightLetters(words);
        expect(result).equal(true);
    });
});
