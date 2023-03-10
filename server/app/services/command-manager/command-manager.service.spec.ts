/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Game } from '@app/classes/game/game';
import { Player } from '@app/classes/player/player';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { RoomManager } from './../room-manager/room-manager.service';
import { SocketManager } from './../socket-manager/socket-manager.service';
import { CommandManager } from './command-manager.service';

describe('CommandManager service tests', () => {
    let commandManager: CommandManager;
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let gameObj: Game;
    const RESPONSE_DELAY = 200;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        // eslint-disable-next-line dot-notation
        service = server['socketManger'];
        clientSocket = ioClient(urlString);
        commandManager = new CommandManager(service.sio, service.identification, service.gameManager);
        gameObj = new Game();
        const user1 = {
            username: 'player1',
            id: '1',
            room: 'room1',
        };
        const user2 = {
            username: 'player2',
            id: 'b',
            room: 'room1',
        };
        gameObj.player1 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
        gameObj.player2 = new Player(gameObj.reserveLetters.randomLettersInitialization(), true, 'player1', user2);
        gameObj.dictionaryArray = JSON.parse(fs.readFileSync('./assets/dictionaries/default-dictionary.json').toString()).words;
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

    it('should handle reserve event if valid', (done) => {
        sinon.replace(service.gameManager, 'reserveCommandValid', () => {
            return true;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'reserveCommandValid');
        commandManager.commandReserve('', '!r??serve'.split(' '));
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle reserve event if Invalid', (done) => {
        sinon.replace(service.gameManager, 'reserveCommandValid', () => {
            return false;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'reserveCommandValid');
        commandManager.commandReserve('', '!r??serve'.split(' '));
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle aide event valid', (done) => {
        sinon.replace(service.gameManager, 'helpCommandValid', () => {
            return false;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'helpCommandValid');
        commandManager.commandHelp('', '!aide'.split(' '));
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle aide event if Invalid', (done) => {
        sinon.replace(service.gameManager, 'helpCommandValid', () => {
            return true;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const reserveSpy = sinon.spy(service.gameManager, 'helpCommandValid');
        commandManager.commandHelp('', '!aide'.split(' '));
        setTimeout(() => {
            expect(reserveSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle passer Event valid turn', (done) => {
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPass('');
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle passer Event Invalid turn', (done) => {
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
        commandManager.commandPass('');
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid place command', (done) => {
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
        commandManager.commandPlace('', '!placer aaa'.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if it is not the right turn', (done) => {
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return false;
        });
        sinon.replace(service.gameManager, 'pass', () => {});

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('1', '!placer aaa'.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid place command if it is player 1', (done) => {
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
        const spyRoomManager = sinon.stub(RoomManager, 'getGoalsPlayer');
        const spy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('1', '!placer ccaaaa'.split(' '));

        setTimeout(() => {
            assert(spy.called);
            assert(spyRoomManager.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid place command but impossible command if it is player 1', (done) => {
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'placeVerification', () => {
            return 'invalide';
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
        const spy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('1', '!placer ccaaaa'.split(' '));

        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if it is player 1', (done) => {
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return true;
        });
        sinon.replace(service.gameManager, 'placeVerification', () => {
            return 'valide';
        });
        sinon.replace(service.gameManager, 'placeWord', () => {
            return 'no';
        });
        sinon.replace(service.gameManager, 'pass', () => {});
        sinon.replace(gameObj, 'playerTurn', () => {
            return gameObj.player2;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const spy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('1', '!placer ccaaaa'.split(' '));

        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid place command if it is player 2', (done) => {
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
            return gameObj.player2;
        });

        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const spy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('b', '!placer aaa'.split(' '));
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command', (done) => {
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return false;
        });
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        const passerSpy = sinon.spy(service.identification, 'getGame');
        commandManager.commandPlace('', '!placer '.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if not placer', (done) => {
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
        commandManager.commandPlace('', '!placer '.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle invalid place command if not placer2', (done) => {
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
        commandManager.commandPlace('', '!placer aaa'.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid echanger command', (done) => {
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
        const exchangeSpy = sinon.spy(service.identification, 'getGame');
        commandManager.commandExchange('ABA', '!??changer a'.split(' '));
        setTimeout(() => {
            assert(exchangeSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid echanger command if it is player 1', (done) => {
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
        const exchangeSpy = sinon.spy(service.identification, 'getGame');
        commandManager.commandExchange('1', '!??changer a'.split(' '));
        setTimeout(() => {
            assert(exchangeSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle Invalid echanger command', (done) => {
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
        commandManager.commandExchange('', '!??changer aaa'.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle valid echanger command not turn', (done) => {
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
        commandManager.commandExchange('', '!??changer aaa'.split(' '));
        setTimeout(() => {
            assert(passerSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should call gameManager methods on indice event when everything is valid', (done) => {
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

        commandManager.commandClue('', '!indice'.split(' '));
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

        commandManager.commandClue('', '!indice'.split(' '));
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should call gameManager methods on indice event when command not valid', (done) => {
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

        commandManager.commandClue('', '!indice'.split(' '));
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            assert(clueCommandSpy.called);
            done();
        }, RESPONSE_DELAY);
    });

    it('should call gameManager methods on indice event when command its not the turn', (done) => {
        sinon.replace(service.identification, 'getGame', () => {
            return gameObj;
        });
        sinon.replace(service.identification, 'getPlayer', () => {
            return 'player1';
        });
        const getGameSpy = sinon.spy(service.identification, 'getGame');
        const getPlayerSpy = sinon.spy(service.identification, 'getPlayer');
        sinon.replace(gameObj, 'playerTurnValid', () => {
            return false;
        });
        const gamePlayerTurnSpy = sinon.spy(gameObj, 'playerTurnValid');
        sinon.replace(service.gameManager, 'clueCommandValid', () => {
            return false;
        });
        const clueCommandSpy = sinon.spy(service.gameManager, 'clueCommandValid');

        commandManager.commandClue('2', '!indice'.split(' '));
        setTimeout(() => {
            assert(getGameSpy.called);
            assert(getPlayerSpy.called);
            assert(gamePlayerTurnSpy.called);
            assert(clueCommandSpy.notCalled);
            done();
        }, RESPONSE_DELAY);
    });
});
