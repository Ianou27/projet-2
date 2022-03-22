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
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { DatabaseService } from './best-score.services';
import { SocketManager } from './socket-manager.service';

const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    const databaseService: DatabaseService = new DatabaseService();

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

        const tiles: Tile[][] = [];
        sinon.replace(service.roomManager, 'joinRoom', () => {
            return tiles;
        });
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
            time: '60',
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
            time: '60',
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

    it('should handle a refused event ', (done) => {
        const roomObject = {
            player1: 'username',
            player2: '',
            time: '60',
        };
        const infoObj = {
            username: 'username',
            roomObj: roomObject,
        };
        service.identification.rooms.push(roomObject);
        clientSocket.emit('refused', 'socketId', infoObj);
        setTimeout(() => {
            expect(service.identification.rooms[0].player1).to.equal('username');

            done();
        }, RESPONSE_DELAY);
    });

    // it('should not broadcast message to room if origin socket is not in room', (done) => {
    //     const testMessage = 'Hello World';
    //     clientSocket.emit('roomMessage', testMessage);
    //     setTimeout(() => {
    //         done();
    //     }, RESPONSE_DELAY);
    // });

    it('should handle a roomMessage event', (done) => {
        const message = 'HELLO';

        sinon.replace(service.gameManager, 'messageVerification', () => {
            return '';
        });
        const spyVerification = sinon.spy(service.gameManager, 'messageVerification');
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
            player2: '',
            time: '60',
        };
        service.identification.rooms.push(roomObject);
        service.identification.roomMessages = new Map();
        sinon.replace(service.gameManager, 'messageVerification', () => {
            return 'valide';
        });
        sinon.replace(service.identification, 'getRoom', () => {
            return 'room';
        });
        sinon.replace(service.identification, 'getUsername', () => {
            return 'username';
        });
        const spyVerification = sinon.spy(service.gameManager, 'messageVerification');
        clientSocket.emit('roomMessage', message);
        setTimeout(() => {
            assert(spyVerification.called);

            done();
        }, RESPONSE_DELAY);
    });

    it('should handle roomMessage if valide player 2', (done) => {
        const message = 'HELLO';
        const roomObject = {
            player1: '',
            player2: 'username',
            time: '60',
        };
        service.identification.rooms.push(roomObject);
        service.identification.roomMessages = new Map();
        sinon.replace(service.gameManager, 'messageVerification', () => {
            return 'valide';
        });
        sinon.replace(service.identification, 'getRoom', () => {
            return 'room';
        });
        sinon.replace(service.identification, 'getUsername', () => {
            return 'username';
        });
        const spyVerification = sinon.spy(service.gameManager, 'messageVerification');
        clientSocket.emit('roomMessage', message);
        setTimeout(() => {
            assert(spyVerification.called);

            done();
        }, RESPONSE_DELAY);
    });

    // it('should handle placer event ', (done) => {
    //     const command = ['!placer'];
    //     let game = new Game();
    //     // const roomObject = {
    //     //     player1: 'username',
    //     //     player2: '',
    //     // };
    //     // service.identification.rooms.push(roomObject);

    //     sinon.replace(game, 'playerTurnValid', () => {return false});
    //     // sinon.replace(service.identification, 'getRoom', () => {return 'room'});
    //     // sinon.replace(service.identification, 'getUsername', () => {return 'username'});
    //     // sinon.replace(service.gameManager, 'placeVerification', () => {return 'sa'});
    //     // sinon.replace(service.gameManager, 'placeWord', () => {return 'placer'});
    //     const spyVerification122 = sinon.spy(game, 'playerTurnValid');
    //     clientSocket.emit('placer', command);
    //     setTimeout(() => {
    //         assert(spyVerification122.called);

    //         done();
    //     }, RESPONSE_DELAY);

    // });

    it('should handle  updateRoom event', (done) => {
        const roomObj = {
            player1: 'username',
            player2: '',
            time: '60',
        };
        service.identification.rooms.push(roomObj);
        clientSocket.emit('updateRoom');
        setTimeout(() => {
            expect(roomObj).to.equal(service.identification.rooms[0]);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle reserve event if valid', (done) => {
        sinon.replace(service.gameManager, 'reserveCommandValid', () => {
            return true;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'reserveCommandValid');
        clientSocket.emit('réserve', ['!réserve']);
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle reserve event if Invalid', (done) => {
        sinon.replace(service.gameManager, 'reserveCommandValid', () => {
            return false;
        });
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
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'reserveCommandValid');
        clientSocket.emit('réserve', ['!réserve']);
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

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

    it('should handle passer Event valid turn', (done) => {
        const gameObj = new Game();
        const user = {
            username: 'player1',
            id: 'socketId',
            room: 'room1',
        };
        gameObj.player1Join(user, '60', databaseService);
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('passer', ['!passer']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle passer Event Invalid turn', (done) => {
        const gameObj = new Game();
        const user1 = {
            username: 'player1',
            id: 'socketId',
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), false, 'player1', user1);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'pass', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('passer', ['!passer']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid place command', (done) => {
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
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'placeVerification', () => {
            return 'valide';
        });
        sinon.replace(service.gameManager, 'placeWord', () => {
            return 'placer';
        });
        sinon.replace(service.gameManager, 'pass', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('placer', ['!placer ']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });
    it('should handle invalid place command', (done) => {
        const gameObj = new Game();
        const user1 = {
            username: 'player1',
            id: clientSocket.id,
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: clientSocket.id,
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return false;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('placer', ['!placer ']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if not placer', (done) => {
        const gameObj = new Game();
        const user1 = {
            username: 'player1',
            id: clientSocket.id,
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: clientSocket.id,
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'placeVerification', () => {
            return 'Invalide';
        });
        sinon.replace(service.gameManager, 'placeWord', () => {
            return 'placer';
        });
        sinon.replace(service.gameManager, 'pass', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('placer', ['!placer ']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if not placer2', (done) => {
        const gameObj = new Game();
        const user1 = {
            username: 'player1',
            id: clientSocket.id,
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: clientSocket.id,
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'placeVerification', () => {
            return 'valide';
        });
        sinon.replace(service.gameManager, 'placeWord', () => {
            return 'pssslacer';
        });
        sinon.replace(service.gameManager, 'pass', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('placer', ['!placer ']);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid echanger command', (done) => {
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
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'exchangeVerification', () => {
            return 'valide';
        });

        sinon.replace(service.gameManager, 'exchange', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('echanger', [['!échanger '], ['aaa']]);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle Invalid echanger command', (done) => {
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
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'exchangeVerification', () => {
            return 'invalide';
        });

        sinon.replace(service.gameManager, 'exchange', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('echanger', [['!échanger '], ['aaa']]);
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid echanger command not turn', (done) => {
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
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return false;
        });
        sinon.replace(service.gameManager, 'exchangeVerification', () => {
            return 'valide';
        });

        sinon.replace(service.gameManager, 'exchange', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player1;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        clientSocket.emit('echanger', [['!échanger '], ['aaa']]);
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
        const spy = sinon.spy(service.roomManager, 'createSoloGame');
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

    it('should call gameManager methods on indice event when command not valid', (done) => {
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
            return false;
        });
        const clueCommandSpy = sinon.spy(service.gameManager, 'clueCommandValid');

        clientSocket.emit('indice', ['!indice']);
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            assert(clueCommandSpy.called);
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
});
