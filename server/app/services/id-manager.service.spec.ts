import { Game } from '@app/classes/game/game';
import { Player } from '@app/classes/player/player';
import { IdManager } from '@app/services/id-manager.service';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';

describe('IdManager tests', () => {
    const idManager = new IdManager();
    const game = new Game();
    idManager.games.push(game);
    beforeEach(() => {
        game.player1Join({ username: 'rt', id: '1', room: 'room1' }, '60');
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', { username: 'rta', id: '2', room: 'room1' });
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
    });

    it('should return empty string if no player matches the username', () => {
        const returnVal = idManager.getId('wrongUsername');
        expect(returnVal).to.equal('');
    });

    it('should return id if player matches the username', () => {
        const returnVal = idManager.getId('rt');
        expect(returnVal).to.equal('1');
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

    it('should return player1 if player1 matches the username', () => {
        const room: Room = {
            player1: 'username',
            player2: 'player2',
            time: '60',
        };
        idManager.rooms.push(room);
        const returnVal = idManager.getPlayer('id');
        expect(returnVal).to.equal('player1');
    });

    it('should return player2 if player2 matches the username', () => {
        const room: Room = {
            player1: 'player1',
            player2: 'username',
            time: '60',
        };
        idManager.rooms.push(room);
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
});
