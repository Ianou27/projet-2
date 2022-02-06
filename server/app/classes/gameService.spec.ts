import { expect } from 'chai';
import { GameService } from './gameService';

describe('Validated Word', () => {
    const game: GameService = new GameService();
    it('method validatedWord should return True when a word is in the dictionary', () => {
        let result = game.validatedWordDictionary("ourson");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return False when a word is not in the dictionary', () => {
        let result = game.validatedWordDictionary("aaaaaaa");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return False when a word is smaller than 2 letters', () => {
        let result = game.validatedWordDictionary("a");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return False if a word contains an apostrophe', () => {
        let result = game.validatedWordDictionary("aujourd'hui");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return False if a word contains an hyphen', () => {
        let result = game.validatedWordDictionary("arc-en-ciel");
        expect(result).to.equals(false);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an accent', () => {
        let result = game.validatedWordDictionary("éléphant");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an cedilla', () => {
        let result = game.validatedWordDictionary("garçon");
        expect(result).to.equals(true);
    });

    it('method validatedWord should return true if the word is in the dictionary even if it contains an diaeresis', () => {
        let result = game.validatedWordDictionary("noël");
        expect(result).to.equals(true);
    });
});
