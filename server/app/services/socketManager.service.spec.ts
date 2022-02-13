import { Game } from '@app/classes/game/game';
import { PlacementCommand } from '@app/classes/placementCommand/placement-command';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketManager } from './socketManager.service';

const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        // eslint-disable-next-line dot-notation
        service = server['socketManger'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        // eslint-disable-next-line dot-notation
        service['sio'].close();
        sinon.restore();
    });

    it('should handle a validate event and call lengthVerification and characterVerification when the message is not a command', (done) => {
        const testMessage = 'ABCDEFGHIJKLMNOP';
        const spyLength = sinon.spy(service, 'lengthVerification');
        const spyCharacters = sinon.spy(service, 'characterVerification');
        clientSocket.emit('validate', testMessage);
        clientSocket.on('wordValidated', () => {
            assert(spyLength.called);
            assert(spyLength.calledWith(testMessage));
            assert(spyCharacters.called);
            assert(spyCharacters.calledWith(testMessage));
            done();
        });
    });
    it('should handle a validate event and not call any function if message is undefined', (done) => {
        const testMessageUndefined = undefined;
        const testMessageEmpty = '';
        const testMessageNull = null;
        const spyLength = sinon.spy(service, 'lengthVerification');
        const spyCharacters = sinon.spy(service, 'characterVerification');
        clientSocket.emit('validate', testMessageUndefined);
        clientSocket.emit('validate', testMessageEmpty);
        clientSocket.emit('validate', testMessageNull);
        assert(spyCharacters.notCalled);
        assert(spyLength.notCalled);
        done();
    });

    it('should handle a validate event and call commandVerification when message is a command', (done) => {
        const testMessage = '!abcde';
        const spyCommand = sinon.spy(service, 'commandVerification');
        clientSocket.emit('validate', testMessage);
        clientSocket.on('commandValidated', () => {
            assert(spyCommand.called);
            assert(spyCommand.calledWith(testMessage));
            done();
        });
    });

    it('should handle a placeFormatVerification event and call placeFormatValidated when message is a command', (done) => {
        const testCommand = '!placer H8v arbre';
        const placeFormatSpy = sinon.spy(service, 'placeFormatValid');
        clientSocket.emit('placeFormatVerification', testCommand);
        clientSocket.on('placeFormatValidated', () => {
            assert(placeFormatSpy.called);
            assert(placeFormatSpy.calledWith(testCommand.split(' ')));
            done();
        });
    });

    it('should handle a createRoom event and call console log', (done) => {
        const username = 'username';
        const room = 'room';
        const logSpy = sinon.spy(console, 'log');
        clientSocket.emit('createRoom', username, room);
        setTimeout(() => {
            assert(logSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a joinRoom event and call console log', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const logSpy = sinon.spy(console, 'log');
        clientSocket.emit('joinRoom', username, roomObj);
        setTimeout(() => {
            assert(logSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a askJoin event and expect player2 to equal -1', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        clientSocket.emit('askJoin', username, roomObj);
        setTimeout(() => {
            expect(roomObj.player2).to.equal('-1');
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a accepted event and call console log', (done) => {
        const socketId = 'socket';
        const gameObj = new Game();
        const roomObject = {
            player1: 'username',
            player2: '',
            game: gameObj,
        };
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        service.rooms.push(roomObject);
        const logSpy = sinon.spy(console, 'log');
        clientSocket.emit('joinRoom', roomObject.player1, roomObject);
        clientSocket.emit('accepted', socketId, infoObj);
        setTimeout(() => {
            assert(logSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a refused event and call console log', (done) => {
        const socketId = 'socket';
        const gameObj = new Game();
        const roomObject = {
            player1: 'username',
            player2: '',
            game: gameObj,
        };
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        service.rooms.push(roomObject);
        const logSpy = sinon.spy(console, 'log');
        clientSocket.emit('joinRoom', roomObject.player1, roomObject);
        clientSocket.emit('refused', socketId, infoObj);
        setTimeout(() => {
            assert(logSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should verify if the command exists and return true if it exists', (done) => {
        const testCommand = '!placer';
        const testCommandFalse = 'abcde';
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(service.commandVerification(testCommand)).to.be.true; // eslint-disable-line no-unused-expressions
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(service.commandVerification(testCommandFalse)).to.be.false; // eslint-disable-line no-unused-expressions
        done();
    });

    it('should verify if the message contains only spaces and return false', (done) => {
        const testMessageSpaces = '          ';
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(service.characterVerification(testMessageSpaces)).to.be.false; // eslint-disable-line no-unused-expressions
        done();
    });

    it('should verify if the message is longer than 512 characters or empty and return false if it is, else return true', (done) => {
        let testMessageLong = 'ABCDEFGHIJKLMNOP';
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 47; i++) {
            testMessageLong += 'ABCDEFGHIJKLMNOP';
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(service.lengthVerification(testMessageLong)).to.be.false; // eslint-disable-line no-unused-expressions
        done();
    });

    it('should add the socket to the room after a join event', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        clientSocket.emit('joinRoom', username, roomObj);
        setTimeout(() => {
            // eslint-disable-next-line dot-notation
            const newRoomSize = service['sio'].sockets.adapter.rooms.get(service['room'])?.size;
            expect(newRoomSize).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('should not broadcast message to room if origin socket is not in room', (done) => {
        const testMessage = 'Hello World';
        // eslint-disable-next-line dot-notation
        const spy = sinon.spy(service['sio'], 'to');
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            assert(spy.notCalled);
            done();
        }, RESPONSE_DELAY);
    });

    it('should broadcast message to room if origin socket is in room', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const testMessage = 'Hello World';
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            done();
        }, RESPONSE_DELAY);
    });

    it('should broadcast message to room if origin socket is in room', (done) => {
        const clientSocket2 = ioClient(urlString);
        const gameObj = new Game();
        const roomObj = {
            player1: 'player1',
            player2: 'player2',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const testMessage = 'Hello World';
        clientSocket.emit('joinRoom', 'player1', roomObj);
        clientSocket2.emit('joinRoom', 'player2', roomObj);
        clientSocket.emit('roomMessage', testMessage);
        clientSocket2.emit('roomMessage', testMessage);
        setTimeout(() => {
            done();
        }, RESPONSE_DELAY);
    });

    it('should console log if command is not valid', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const testMessage = '!test';
        const logSpy = sinon.spy(console, 'log');
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            assert(logSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const testMessage = '!placer';
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command on board', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const testMessage = '!placer H8v zzzzzzz';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            done();
        }, RESPONSE_DELAY);
    });

    it('should call placeWord if valid place command', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        const testMessage = '!placer H8v aa';
        const placeSpy = sinon.spy(service, 'placeWord');
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            assert(placeSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    /* it('should call emit in current room', (done) => {
        const gameObj = new Game();
        const username = 'username';
        const user = {
            username: 'username',
            id: 'testId',
            room: 'testRoom',
        };
        const roomObj = {
            player1: username,
            player2: '',
            game: gameObj,
        };
        service.rooms.push(roomObj);
        service.users.push(user);
        const testMessage = 'allo';
        // eslint-disable-next-line dot-notation
        const emitSpy = sinon.spy(service['sio'].to(user.room), 'emit');
        clientSocket.emit('joinRoom', username, roomObj);
        clientSocket.emit('roomMessage', testMessage);
        setTimeout(() => {
            assert(emitSpy.called);
            done();
        }, RESPONSE_DELAY);
    }); */

    it('should broadcast message to multiple clients on broadcastAll event', (done) => {
        const clientSocket2 = ioClient(urlString);
        const testMessage = 'Hello World';
        // eslint-disable-next-line dot-notation
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('broadcastAll', testMessage);
        clientSocket2.on('massMessage', (message: string) => {
            expect(message).to.contain(testMessage);
            assert(spy.called);
            done();
        });
    });

    it('should handle updateRoom event and emit rooms', (done) => {
        // eslint-disable-next-line dot-notation
        const emitSpy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('updateRoom');
        setTimeout(() => {
            assert(emitSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle deleteRoom event and emit rooms', (done) => {
        const getSpy = sinon.spy(service, 'getRoom');
        clientSocket.emit('deleteRoom');
        setTimeout(() => {
            assert(getSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('getId should return the id associated with the username', (done) => {
        const user = {
            username: 'username',
            id: 'testId',
            room: 'testRoom',
        };
        service.users.push(user);
        const returnId = service.getId(user.username);
        setTimeout(() => {
            expect(returnId).to.equal('testId');
            done();
        }, RESPONSE_DELAY);
    });

    it('placeWord() should call placeWord in PlacementCommand', (done) => {
        const game = new Game();
        const testCommand = '!placer H8v arbre';
        const placeSpy = sinon.spy(PlacementCommand, 'placeWord');
        service.placeWord(testCommand.split(' '), game);
        setTimeout(() => {
            assert(placeSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('placeBoardValid() should call validatedPlaceCommandBoard in PlacementCommand and return true if valid', (done) => {
        const game = new Game();
        const testCommand = '!placer H8v aa';
        const placeSpy = sinon.spy(PlacementCommand, 'validatedPlaceCommandBoard');
        const returnVal = service.placeBoardValid(testCommand.split(' '), game);
        setTimeout(() => {
            assert(placeSpy.called);
            assert(placeSpy.calledWith(testCommand.split(' '), game));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(returnVal).to.be.true; // eslint-disable-line no-unused-expressions
            done();
        }, RESPONSE_DELAY);
    });

    it('placeBoardValid() should call validatedPlaceCommandBoard in PlacementCommand and return false if not valid', (done) => {
        const game = new Game();
        const testCommand = '!placer H8v aaaaaaaaa';
        const command = testCommand.split(' ');
        const placeSpy = sinon.spy(PlacementCommand, 'validatedPlaceCommandBoard');
        const returnVal = service.placeBoardValid(command, game);
        setTimeout(() => {
            assert(placeSpy.called);
            assert(placeSpy.calledWith(command, game));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(returnVal).to.be.false; // eslint-disable-line no-unused-expressions
            done();
        }, RESPONSE_DELAY);
    });

    it('joined() should return true', (done) => {
        const returnVal = service.joined();
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(returnVal).to.be.true; // eslint-disable-line no-unused-expressions
            done();
        }, RESPONSE_DELAY);
    });
});
