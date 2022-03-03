import { RoomManager } from '@app/services/room-manager.service';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { IdManager } from './id-manager.service';

describe('IdManager tests', () => {
    const roomManager = new RoomManager();
    const idManager = new IdManager();
    const sio = new io.Server();

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
        sinon.restore();
    });

    it('should join a room and set player2 name if player2 name length is 0', () => {
        const username = 'player2';
        const socketId = 'id';
        const room: Room = {
            player1: 'player1',
            player2: '',
        };
        const room2: Room = {
            player1: 'username',
            player2: 'player2Test',
        };
        idManager.rooms.push(room);
        idManager.rooms.push(room2);
        roomManager.joinRoom(username, room, socketId, idManager, sio);
        expect(room.player2).to.equal(username);
    });

    it('should join a room', () => {
        const username = 'username';
        const socketId = 'id';
        const room: Room = {
            player1: 'player1',
            player2: '',
        };
        idManager.rooms.push(room);
        roomManager.joinRoom(username, room, socketId, idManager, sio);
    });

    it('cancelCreation should call getUsername', () => {
        const getUserSpy = sinon.stub(idManager, 'getUsername');
        roomManager.cancelCreation('test', idManager);
        assert(getUserSpy.called);
    });

    it('should cancel creation and deleteRoom', () => {
        const socketId = 'id';
        const room: Room = {
            player1: 'username',
            player2: '',
        };
        idManager.rooms.push(room);
        const deleteSpy = sinon.stub(roomManager, 'deleteRoom');
        roomManager.cancelCreation(socketId, idManager);
        assert(deleteSpy.called);
    });

    it('should delete room', () => {
        const socketId = 'id';
        const room: Room = {
            player1: '-2',
            player2: 'username',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
    });

    it('deleteRoom should set player1 to -2 if player2 = username and player1 is different than -2', () => {
        const socketId = 'id';
        const room: Room = {
            player1: 'test',
            player2: 'username',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
        expect(room.player2).to.equal('-2');
    });

    it('should delete room if there is no player2', () => {
        const spliceSpy = sinon.stub(idManager.rooms, 'splice');
        const socketId = 'id';
        const room: Room = {
            player1: 'username',
            player2: '',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
        assert(spliceSpy.called);
    });

    it('should delete room if player2 = -2', () => {
        const spliceSpy = sinon.stub(idManager.rooms, 'splice');
        const socketId = 'id';
        const room: Room = {
            player1: 'username',
            player2: '-2',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
        assert(spliceSpy.called);
    });

    it('deleteRoom should set player1 to -2 if player1 = username and player2 is in room', () => {
        const socketId = 'id';
        const room: Room = {
            player1: 'username',
            player2: 'player2',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
        expect(room.player1).to.equal('-2');
    });

    it('should create a room', () => {
        const username = 'username';
        const room = 'room';
        const socketId = 'id';
        const usersSpy = sinon.spy(idManager.users, 'push');
        const roomsSpy = sinon.spy(idManager.rooms, 'push');
        roomManager.createRoom(username, room, socketId, idManager, '60');
        assert(usersSpy.called);
        assert(roomsSpy.called);
    });
});
