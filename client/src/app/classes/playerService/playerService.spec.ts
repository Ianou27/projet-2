import { PlayerService } from './playerService';

describe('Player', () => {
    let letters = ['a', 'a', 'b', 'c', 'z', 'r', 'p']
    let hisTurn = true;
    const player: PlayerService = new PlayerService(letters, hisTurn);
    it('constructor should construct a player with letters ', () => {
        let playerLetters = player.getLetters();
        expect(letters).toEqual(playerLetters);
    });

    it('constructor should construct a player with an attribute turn', () => {
        let playerHisTurn = player.getHisTurn();
        expect(hisTurn).toEqual(playerHisTurn);
    });

    it('method changeTurn should switch the turn of the player', () => {
        player.changeTurn();
        let playerHisTurn = player.getHisTurn();
        expect(!hisTurn).toEqual(playerHisTurn);
        player.changeTurn();
    });


});