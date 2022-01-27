import { expect } from 'chai';
import { Game } from './game';

describe('GameClass', () => {
    const game: Game = new Game();
    it('method validatedWord should return True when a word is in the dictionary', () => {
        let result = game.validatedWord("ourson");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return False when a word is not in the dictionary', () => {
        let result = game.validatedWord("aaaaaaa");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return False when a word is smaller than 2 letters', () => {
        let result = game.validatedWord("a");
        expect(result).to.equals(false);
    });
});
