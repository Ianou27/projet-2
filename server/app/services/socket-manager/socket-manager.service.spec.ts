/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-lines */
// import { Game } from '@app/classes/game/game';
// import { CaseProperty } from '@common/assets/case-property';
// import { letterValue } from '@common/assets/reserve-letters';
// import { Game } from '@app/classes/game/game';
import { Game } from '@app/classes/game/game';
import { Player } from '@app/classes/player/player';
import { Tile } from '@common/tile/Tile';
// import { Game } from '@app/classes/game/game';
import { Server } from 'app/server';
import { fail } from 'assert';
import { assert, expect } from 'chai';
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
        const spy = sinon.stub(service.roomManager, 'createRoom');
        clientSocket.emit('createRoom', username, room);
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a joinRoom event', () => {
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
        };
        const tiles: Tile[][] = [];
        sinon.replace(service.roomManager, 'joinRoom', () => {
            return tiles;
        });
        const spy = sinon.spy(service.roomManager, 'joinRoom');
        clientSocket.emit('joinRoom', username, roomObj);
        setTimeout(() => {
            assert(spy.called);
        }, RESPONSE_DELAY);
    });

    it('should handle a askJoin event', (done) => {
        const username = 'username';
        const roomObj = {
            player1: username,
            player2: '',
            time: '60',
            mode2990: false,
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
            player2: 's',
            time: '60',
            mode2990: false,
        };
        service.identification.rooms = [roomObject];
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        sinon.replace(service.identification, 'getUsername', () => {
            return 'username';
        });
        clientSocket.emit('accepted', 'socketId', infoObj);
        setTimeout(() => {
            expect(service.identification.rooms[0].player2).to.equal('');

            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a refused event ', (done) => {
        const roomObject = {
            player1: 'username',
            player2: 's',
            time: '60',
            mode2990: false,
        };
        service.identification.rooms = [roomObject];
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        sinon.replace(service.identification, 'getUsername', () => {
            return 'username';
        });
        clientSocket.emit('refused', 'socketId', infoObj);
        setTimeout(() => {
            expect(service.identification.rooms[0].player2).to.equal('');

            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a roomMessage event', (done) => {
        const message = 'HELLO';

        sinon.replace(service.gameManager, 'messageVerification', () => {
            return '';
        });
        const spyVerification = sinon.stub(service.gameManager, 'messageVerification');
        clientSocket.emit('roomMessage', message);
        setTimeout(() => {
            assert(spyVerification.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle roomMessage if valide player1', (done) => {
        const message = 'HELLO';
        const roomObject = {
            player1: 'username',
            player2: 'user2',
            time: '60',
            mode2990: false,
        };
        service.identification.rooms = [roomObject];
        service.identification.roomMessages['room'] = [];
        sinon.replace(service.gameManager, 'messageVerification', () => {
            return 'valide';
        });
        sinon.replace(service.identification, 'getRoom', () => {
            return 'room';
        });
        sinon.replace(service.identification, 'getUsername', () => {
            return 'username';
        });
        const spyVerification = sinon.stub(service.gameManager, 'messageVerification');
        clientSocket.emit('roomMessage', message);
        setTimeout(() => {
            assert(spyVerification.called);

            done();
        }, RESPONSE_DELAY);
    });

    it('should handle roomMessage if valide player 2', (done) => {
        const message = 'HELLO';
        const roomObject = {
            player1: 'username',
            player2: 'user2',
            time: '60',
            mode2990: false,
        };
        service.identification.rooms = [roomObject];
        service.identification.roomMessages['room'] = [];
        sinon.replace(service.gameManager, 'messageVerification', () => {
            return 'valide';
        });
        sinon.replace(service.identification, 'getRoom', () => {
            return 'room';
        });
        sinon.replace(service.identification, 'getUsername', () => {
            return 'user2';
        });
        const spyVerification = sinon.stub(service.gameManager, 'messageVerification');
        clientSocket.emit('roomMessage', message);
        setTimeout(() => {
            assert(spyVerification.called);

            done();
        }, RESPONSE_DELAY);
    });

    it('should handle  updateRoom event', (done) => {
        const roomObj = {
            player1: 'username',
            player2: '',
            time: '60',
            mode2990: false,
        };
        service.identification.rooms.push(roomObj);
        clientSocket.emit('updateRoom');
        setTimeout(() => {
            expect(roomObj).to.equal(service.identification.rooms[0]);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle passer event', (done) => {
        const passerSpy = sinon.stub(service.commandManager, 'commandPass');
        clientSocket.emit('passer', ['!passer']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a createSoloGame event', (done) => {
        const username = 'username';
        sinon.replace(service.roomManager, 'createSoloGame', () => {});
        sinon.replace(service.roomManager, 'getRandomBotName', () => {
            return 'bot';
        });
        const spy = sinon.stub(service.roomManager, 'createSoloGame');
        clientSocket.emit('createSoloGame', username, '60');
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should call gameManager methods on indice event when everything is valid', (done) => {
        const gameObj = new Game();
        const a: boolean = clientSocket.disconnected;
        const user1 = {
            username: 'player1',
            id: a.toString(),
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: 'b',
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), false, 'player2', user2);
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        sinon.replace(service.identification, 'getPlayer', () => {
            return 'AAAAA';
        });
        const getGameSpy = sinon.spy(service.identification, 'getGame');
        const getPlayerSpy = sinon.spy(service.identification, 'getPlayer');
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        const gamePlayerTurnSpy = sinon.spy(gameObj, 'playerTurnValid');
        sinon.replace(service.gameManager, 'clueCommandValid', () => {
            return true;
        });
        const clueCommandSpy = sinon.spy(service.gameManager, 'clueCommandValid');
        sinon.replace(service.gameManager, 'formatClueCommand', () => {
            return ['!indice'];
        });
        const clueFormatSpy = sinon.spy(service.gameManager, 'formatClueCommand');

        clientSocket.emit('indice', ['!indice']);
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            assert(clueCommandSpy.called);
            assert(clueFormatSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should call gameManager methods on indice event', (done) => {
        const gameObj = new Game();
        const a: boolean = clientSocket.disconnected;
        const user1 = {
            username: 'player1',
            id: a.toString(),
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: 'b',
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), false, 'player2', user2);
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        sinon.replace(service.identification, 'getPlayer', () => {
            return 'AAAAA';
        });
        const getGameSpy = sinon.spy(service.identification, 'getGame');
        const getPlayerSpy = sinon.spy(service.identification, 'getPlayer');
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        const gamePlayerTurnSpy = sinon.spy(gameObj, 'playerTurnValid');

        clientSocket.emit('indice', ['!indice']);
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle cancelCreation event', (done) => {
        sinon.replace(service.roomManager, 'cancelCreation', () => {});
        const cancelSpy = sinon.spy(service.roomManager, 'cancelCreation');

        clientSocket.emit('cancelCreation');
        setTimeout(() => {
            assert(cancelSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle getBestScore event', (done) => {
        const dbSpy = sinon.spy(service.databaseService, 'start');

        clientSocket.emit('getBestScore');
        setTimeout(() => {
            assert(dbSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle convertToSoloGame event', (done) => {
        sinon.replace(service.roomManager, 'convertMultiToSolo', () => {});
        const spy = sinon.spy(service.roomManager, 'convertMultiToSolo');

        clientSocket.emit('convertToSoloGame');
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle forceDisconnect event', (done) => {
        sinon.replace(service.databaseService, 'closeConnection', async () => {
            return;
        });
        const spy = sinon.spy(service.databaseService, 'closeConnection');

        clientSocket.emit('forceDisconnect');
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle getBestScore event', (done) => {
        const spy = sinon.spy(service.databaseService, 'start');
        try {
            service.databaseService.start('fgfdg');
            fail();
        } catch {
            clientSocket.emit('getBestScore');
            setTimeout(() => {
                assert(spy.called);
                done();
            }, RESPONSE_DELAY);
        }
    });
});
