import { Game } from '@app/classes/game/game';
import { Player } from '@app/classes/player/player';
import { IdManager } from '@app/services/id-manager/id-manager.service';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { DatabaseService } from './../best-score/best-score.services';

describe('IdManager tests', () => {
    const idManager = new IdManager();

    const databaseService: DatabaseService = new DatabaseService();
    const game = new Game();
    const game2 = new Game();
    idManager.games.push(game);
    idManager.games.push(game2);
    beforeEach(() => {
        game.player1Join({ username: 'rt', id: '1', room: 'room1' }, '60', databaseService, false);
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'rta', id: '2', room: 'room1' });
        game2.player1Join({ username: 'u', id: '3', room: 'room2' }, '60', databaseService, false);
        game2.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'u2', id: '4', room: 'room2' });
        const user: User = {
            username: 'username',
            id: 'id',
            room: 'room',
        };

        idManager.users.push(user);
    });

    afterEach(() => {
        idManager.users.forEach(() => {
            idManager.users.pop();
        });
        idManager.rooms.forEach(() => {
            idManager.rooms.pop();
        });

        sinon.restore();
    });

    it('should return empty string if no player matches the username', () => {
        const returnVal = idManager.getId('wrongUsername');
        expect(returnVal).to.equal('');
    });

    it('should return id if player matches the username', () => {
        const returnVal = idManager.getId('rt');
        expect(returnVal).to.equal('1');
    });
    it('should return id if player matches the username (player2)', () => {
        const returnVal = idManager.getId('rta');
        expect(returnVal).to.equal('2');
    });

    it('should return empty string if socket does not match', () => {
        const returnVal = idManager.getUsername('wrongId');
        expect(returnVal).to.equal('');
    });

    it('should return username if socket matches', () => {
        const returnVal = idManager.getUsername('id');
        expect(returnVal).to.equal('username');
    });

    it('should return empty string if socket does not match', () => {
        const returnVal = idManager.getPlayer('wrongId');
        expect(returnVal).to.equal('');
    });

    it('should return winner player 1 username when surrender', () => {
        sinon.replace(idManager, 'getUsername', () => {
            return 'username';
        });
        const room: Room = {
            player1: 'user',
            player2: 'username',
            time: '60',
        };
        idManager.rooms.push(room);

        const returnVal = idManager.surrender('id');
        expect(returnVal).to.equal('user');
    });

    it('should return winner player 2 username when surrender', () => {
        sinon.replace(idManager, 'getUsername', () => {
            return 'user';
        });
        idManager.rooms = [
            {
                player1: 'user',
                player2: 'username',
                time: '60',
            },
        ];

        const returnVal = idManager.surrender('1111');
        expect(returnVal).to.equal('username');
    });

    it('should return player1 if player1 matches the username', () => {
        const room: Room = {
            player1: 'rt',
            player2: 'rta',
            time: '60',
        };
        idManager.rooms.push(room);
        sinon.replace(idManager, 'getUsername', () => {
            return 'rt';
        });
        const returnVal = idManager.getPlayer('id');
        expect(returnVal).to.equal('player1');
    });

    it('should return player1 if player2 matches the username', () => {
        const room: Room = {
            player1: 'rt',
            player2: 'rta',
            time: '60',
        };
        idManager.rooms.push(room);
        sinon.replace(idManager, 'getUsername', () => {
            return 'rta';
        });
        const returnVal = idManager.getPlayer('id');
        expect(returnVal).to.equal('player2');
    });

    it('should return empty string if id does not match', () => {
        const returnVal = idManager.getRoom('wrongId');
        expect(returnVal).to.equal('');
    });

    it('should return room if id matches', () => {
        const returnVal = idManager.getRoom('id');
        expect(returnVal).to.equal('room');
    });

    it('should do nothing if id does not match', () => {
        const user2: User = {
            username: 'newUsername',
            id: 'id2',
            room: 'newRoom',
        };
        idManager.users.push(user2);
        const userSpy = sinon.spy(idManager.users, 'splice');
        idManager.deleteUser('id2');
        assert(userSpy.called);
    });

    it('should return game when given id of player1', () => {
        const returnVal = idManager.getGame('1');
        expect(returnVal).to.equal(game);
    });

    it('should return game when given id of player2', () => {
        const returnVal = idManager.getGame('2');
        expect(returnVal).to.equal(game);
    });

    it('should delete a created game if player1 socket is given', () => {
        idManager.deleteGame('3');
        expect(idManager.games.length).to.equal(1);
    });

    it('should delete a created game if player2 socket is given', () => {
        idManager.deleteGame('2');

        expect(idManager.games.length).to.equal(0);
    });
});
