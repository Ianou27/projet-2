/* eslint-disable @typescript-eslint/no-empty-function */
import { Game } from '@app/classes/game/game';
import { RoomManager } from '@app/services/room-manager/room-manager.service';
import { BotType } from '@common/botType';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { DatabaseService } from './../best-score/best-score.services';
import { IdManager } from './../id-manager/id-manager.service';

describe('Room Manager tests', () => {
    const roomManager = new RoomManager();
    const idManager = new IdManager();
    const sio = new io.Server();
    const databaseService: DatabaseService = new DatabaseService();

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

    it('should  join Game', () => {
        const game = new Game();
        game.player1Join({ username: 'rt', id: '1', room: 'room1' }, '60', databaseService, false);
        const room: Room = {
            player1: 'rt',
            player2: '',
            time: '60',
        };
        sinon.replace(idManager, 'getGame', () => {
            return game;
        });
        sinon.replace(game, 'startGame', () => {});
        idManager.rooms.push(room);
        roomManager.joinRoom('rta', room, '12', idManager, sio);

        expect(idManager.rooms[0].player2).to.equal('rta');
    });

    it('convertMultiToSolo should call create SoloGame', () => {
        sinon.replace(idManager, 'getGame', () => {
            const game = new Game();
            game.player1Join({ username: 'rt', id: '1', room: 'room1' }, '60', databaseService, false);

            return game;
        });
        sinon.replace(roomManager, 'cancelCreation', () => {});
        sinon.replace(roomManager, 'createSoloGame', () => {});
        const getUserSpy = sinon.spy(roomManager, 'convertMultiToSolo');
        roomManager.convertMultiToSolo('test', idManager, sio, databaseService, false);
        assert(getUserSpy.called);
    });

    it('should   create SoloGame and call startSoloGame', () => {
        roomManager.createSoloGame('username', '1234', idManager, sio, '30', databaseService, 'botName', BotType.Beginner, false);

        expect(idManager.games.length).to.equal(1);
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
            time: '60',
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
            time: '60',
        };
        idManager.rooms.push(room);
        roomManager.deleteRoom(socketId, idManager);
    });

    it('deleteRoom should set player1 to -2 if player2 = username and player1 is different than -2', () => {
        const socketId = 'id';
        const room: Room = {
            player1: 'test',
            player2: 'username',
            time: '60',
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
            time: '60',
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
            time: '60',
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
            time: '60',
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
        roomManager.createRoom(username, room, socketId, idManager, '60', databaseService, false);
        assert(usersSpy.called);
        assert(roomsSpy.called);
    });
});
