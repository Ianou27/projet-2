import { expect } from 'chai';
import { Game } from './game';

describe('GameClass', () => {
    const game: Game = new Game();
    it('method validatedWord should return True when a word is in the dictionary', () => {
        let result = game.validatedWord("aas");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return False when a word is in the dictionary', () => {
        let result = game.validatedWord("abbfds");
        expect(result).to.equals(false);
    });
});
