/* eslint-disable max-lines */
// import { Game } from '@app/classes/game/game';
// import { CaseProperty } from '@common/assets/case-property';
// import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
// import { Game } from '@app/classes/game/game';
import { Server } from 'app/server';
import { assert, expect} from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketManager } from './socket-manager.service';

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
        service.identification.rooms.forEach(() => {
            service.identification.rooms.pop();
        });
    });

    it('should handle a createRoom event', (done) => {
        const username = 'username';
        const room = 'room';
        sinon.replace(service.roomManager, 'createRoom', () => {});
        const spy = sinon.spy(service.roomManager, 'createRoom');
        clientSocket.emit('createRoom', username, room);
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a joinRoom event', (done) => {
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
        };

        let tiles: Tile[][] = [];
        sinon.replace(service.roomManager, 'joinRoom', () => {return tiles });
        const spy = sinon.spy(service.roomManager, 'joinRoom');
        clientSocket.emit('joinRoom', username, roomObj);
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a askJoin event', (done) => {
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
        };
        service.identification.rooms.push(roomObj);
        clientSocket.emit('askJoin', username, roomObj);
        setTimeout(() => {
            expect(roomObj.player2).to.equal('-1');
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a accepted event ', (done) => {
        
        const roomObject = {
            player1: 'username',
            player2: '',
        };
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        service.identification.rooms.push(roomObject);
        clientSocket.emit('accepted', 'socketId', infoObj);
        setTimeout(() => {
            expect(service.identification.rooms[0].player1).to.equal('username');
            
            done();
        }, RESPONSE_DELAY);
    });
 
    // it('should handle a refused event and call console log', (done) => {
    //     const socketId = 'socket';
    //     const gameObj = new Game();
    //     const roomObject = {
    //         player1: 'username',
    //         player2: '',
    //         game: gameObj,
    //     };
    //     const infoObj = {
    //         username: 'username',
    //         roomObj: roomObject,
    //     };
    //     service.identification.rooms.push(roomObject);
    //     const logSpy = sinon.spy(console, 'log');
    //     clientSocket.emit('joinRoom', roomObject.player1, roomObject);
    //     clientSocket.emit('refused', socketId, infoObj);
    //     setTimeout(() => {
    //         assert(logSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should add the socket to the room after a join event', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     setTimeout(() => {
    //         // eslint-disable-next-line dot-notation
    //         const newRoomSize = service.identification.rooms.length;
    //         expect(newRoomSize).to.equal(1);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should not broadcast message to room if origin socket is not in room', (done) => {
    //     const testMessage = 'Hello World';
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should broadcast message to room if origin socket is in room', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = 'Hello World';
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should broadcast message to room if origin socket is in room', (done) => {
    //     const clientSocket2 = ioClient(urlString);
    //     const gameObj = new Game();
    //     const roomObj = {
    //         player1: 'player1',
    //         player2: 'player2',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = 'Hello World';
    //     clientSocket.emit('joinRoom', 'player1', roomObj);
    //     clientSocket2.emit('joinRoom', 'player2', roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     clientSocket2.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle roomMessage event with !passer', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!passer';
    //     const passSpy = sinon.spy(service.gameManager, 'passVerification');
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         assert(passSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle invalid !passer command', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!passer test';
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle invalid place command', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!placer';
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should place command from player2', (done) => {
    //     const clientSocket2 = ioClient(urlString);
    //     const gameObj = new Game();
    //     const letters = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
    //     const lettersTilePlayer1: Tile[] = [];
    //     for (const letter of letters) {
    //         const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
    //         tile1.letter = letter;
    //         tile1.value = letterValue[letter];
    //         lettersTilePlayer1.push(tile1);
    //     }
    //     gameObj.player1.letters = lettersTilePlayer1;
    //     gameObj.player2.letters = lettersTilePlayer1;
    //     const roomObj = {
    //         player1: 'player1',
    //         player2: 'player2',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = 'Hello World';
    //     const testCommand = '!placer H8v aa';
    //     clientSocket.emit('joinRoom', 'player1', roomObj);
    //     clientSocket2.emit('joinRoom', 'player2', roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     clientSocket2.emit('roomMessage', testCommand);
    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
    //     setTimeout(() => {}, RESPONSE_DELAY);
    //     done();
    // });

    // it('should handle invalid place command on board', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const testMessage = '!placer H8v zzzzzzz';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should call placeWord if valid place command', (done) => {
    //     const gameObj = new Game();
    //     const letters = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
    //     const lettersTilePlayer1: Tile[] = [];
    //     for (const letter of letters) {
    //         const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
    //         tile1.letter = letter;
    //         tile1.value = letterValue[letter];
    //         lettersTilePlayer1.push(tile1);
    //     }
    //     gameObj.player1.letters = lettersTilePlayer1;
    //     const roomObj = {
    //         player1: 'player1',
    //         player2: 'player2',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!placer H8v aa';
    //     const placeSpy = sinon.stub(service.gameManager, 'placeWord');
    //     clientSocket.emit('joinRoom', 'player1', roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         assert(placeSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle invalid !echanger command', (done) => {
    //     const gameObj = new Game();
    //     const username = 'username';
    //     const roomObj = {
    //         player1: username,
    //         player2: '',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!echanger test';
    //     const verifSpy = sinon.stub(service.gameManager, 'exchangeVerification');
    //     clientSocket.emit('joinRoom', username, roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         assert(verifSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle valid !echanger command', (done) => {
    //     const gameObj = new Game();
    //     const letters = ['A', 'A', 'A', 'A', 'A', 'A', 'A'];
    //     const lettersTilePlayer1: Tile[] = [];
    //     for (const letter of letters) {
    //         const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
    //         tile1.letter = letter;
    //         tile1.value = letterValue[letter];
    //         lettersTilePlayer1.push(tile1);
    //     }
    //     gameObj.player1.letters = lettersTilePlayer1;
    //     const roomObj = {
    //         player1: 'player1',
    //         player2: 'player2',
    //         game: gameObj,
    //     };
    //     service.identification.rooms.push(roomObj);
    //     const testMessage = '!echanger aaa';
    //     const exchangeSpy = sinon.stub(service.gameManager, 'exchange');
    //     clientSocket.emit('joinRoom', 'player1', roomObj);
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         assert(exchangeSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    // it('should handle updateRoom event and emit rooms', (done) => {
    //     // eslint-disable-next-line dot-notation
    //     const emitSpy = sinon.spy(service['sio'].sockets, 'emit');
    //     clientSocket.emit('updateRoom');
    //     setTimeout(() => {
    //         assert(emitSpy.called);
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    /*it('should handle passer event1', () => {

      
        sinon.replace(service.identification, 'getUsername', () => {
            return "player1";
        });
        sinon.replace(service.identification, 'getRoom', () => {
            return 'room1';
        });
        sinon.replace(service.identification, 'getGame', () => {
            return new Game();
        });
        const userSpy = sinon.spy(service.identification, 'getUsername');
        const roomSpy = sinon.spy(service.identification, 'getRoom');
        const gameSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('passer');
        setTimeout(() => {
            assert(userSpy.called);
            assert(roomSpy.called);
            assert(gameSpy.called);
            done();
        }, RESPONSE_DELAY);
    });*/

    it('should handle cancelCreation event', (done) => {
        sinon.replace(service.roomManager, 'cancelCreation', () => {});
        const cancelSpy = sinon.spy(service.roomManager, 'cancelCreation');

        clientSocket.emit('cancelCreation');
        setTimeout(() => {
            assert(cancelSpy.called);
            done();
        }, RESPONSE_DELAY);
    });
});
