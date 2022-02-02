import { GameBoardService } from './gameBoardService';

describe('GameBoard', () => {
    const gameBoard: GameBoardService = new GameBoardService();
    it('constructor should construct a gameBoard of 15x15 tiles ', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            result += colonne.length;
        }
        expect(result).toEqual(225);
    });

    it('constructor should construct a gameBoard of 15x15 tiles ', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            result += colonne.length;
        }
        expect(result).toEqual(225);
        expect(gameBoard.cases.length).toEqual(15);
    });

    it('gameBoard should contains 8 tiles with the property wordTriple', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            for(let tile of colonne){
                if(tile.getSpecialProperty() === caseProperty.wordTriple){
                    result += 1;
                }
            }
        }
        expect(result).toEqual(8);
    });

    it('gameBoard should contains 18 tiles with the property wordDouble', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            for(let tile of colonne){
                if(tile.getSpecialProperty() === caseProperty.wordDouble){
                    result += 1;
                }
            }
        }
        expect(result).toEqual(18);
    });

    it('gameBoard should contains 12 tiles with the property letterTriple', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            for(let tile of colonne){
                if(tile.getSpecialProperty() === caseProperty.letterTriple){
                    result += 1;
                }
            }
        }
        expect(result).toEqual(12);
    });

    it('gameBoard should contains 24 tiles with the property letterDouble', () => {
        let result = 0;
        for(let colonne of gameBoard.cases){
            for(let tile of colonne){
                if(tile.getSpecialProperty() === caseProperty.letterDouble){
                    result += 1;
                }
            }
        }
        expect(result).toEqual(24);
    });

    it('tileContainsLetter should return false if the tile doesnt contain a letter', () => {
        let position = [0,0];
        let result = gameBoard.tileContainsLetter(position);
        expect(result).toEqual(false);
    });

    it('tileContainsLetter should return true if the tile contains a letter', () => {
        let position = [0,0];
        let letter = "a";
        gameBoard.addLetterTile(position, letter);
        let result = gameBoard.tileContainsLetter(position);
        expect(result).toEqual(true);
    });
});