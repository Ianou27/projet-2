import { Game } from '@app/classes/game/game';
import { IdManager } from '@app/services/idManager.service';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';

describe('IdManager tests', () => {
    const idManager = new IdManager();

    beforeEach(() => {
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
        const returnVal = idManager.getId('username');
        expect(returnVal).to.equal('id');
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
        const testGame = new Game();
        const room: Room = {
            player1: 'username',
            player2: 'player2',
            game: testGame,
        };
        idManager.rooms.push(room);
        const returnVal = idManager.getPlayer('id');
        expect(returnVal).to.equal('player1');
    });

    it('should return player2 if player2 matches the username', () => {
        const testGame = new Game();
        const room: Room = {
            player1: 'player1',
            player2: 'username',
            game: testGame,
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
