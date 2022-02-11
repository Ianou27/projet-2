import { PlayerService } from './player.service';

describe('Player', () => {
    const letters = ['a', 'a', 'b', 'c', 'z', 'r', 'p'];
    const hisTurn = true;
    let player: PlayerService = new PlayerService(letters, hisTurn);
    beforeEach(() => {
        player = new PlayerService(letters, hisTurn);
    });

    it('constructor should construct a player with letters ', () => {
        const playerLetters = player.getLetters();
        expect(letters).toEqual(playerLetters);
    });

    it('constructor should construct a player with an attribute turn', () => {
        const playerHisTurn = player.getHisTurn();
        expect(hisTurn).toEqual(playerHisTurn);
    });

    it('method changeTurn should switch the turn of the player', () => {
        player.changeTurn();
        const playerHisTurn = player.getHisTurn();
        expect(!hisTurn).toEqual(playerHisTurn);
    });
});
