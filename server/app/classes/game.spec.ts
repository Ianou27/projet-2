import { expect } from 'chai';
import { Game } from './game';

describe('Validated Word', () => {
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

    it('method validatedWord should return False if a word contains an apostrophe', () => {
        let result = game.validatedWord("aujourd'hui");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return False if a word contains an hyphen', () => {
        let result = game.validatedWord("arc-en-ciel");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an accent', () => {
        let result = game.validatedWord("éléphant");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an cedilla', () => {
        let result = game.validatedWord("garçon");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an diaeresis', () => {
        let result = game.validatedWord("noël");
        expect(result).to.equals(true);
    });
});
