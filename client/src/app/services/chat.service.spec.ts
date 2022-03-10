/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
// eslint-disable-next-line no-restricted-imports
import { Tile } from '../../../../common/tile/Tile';
import { InfoToJoin, Message, Room } from './../../../../common/types';
import { Game } from './../../../../server/app/classes/game/game';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatService);
        socketTestHelper = new SocketTestHelper();
        service.socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not connect if socket is alive', () => {
        const connectSpy = spyOn(service.socketService, 'connect');
        const configureSpy = spyOn(service, 'configureBaseSocketFeatures');
        const updateSpy = spyOn(service, 'updateRooms');
        service.socketService.socket.connected = false;
        service.connect();
        expect(connectSpy).toHaveBeenCalled();
        expect(configureSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });

    it('should connect if socket is not alive', () => {
        const connectSpy = spyOn(service.socketService, 'connect');
        const configureSpy = spyOn(service, 'configureBaseSocketFeatures');
        const updateSpy = spyOn(service, 'updateRooms');
        service.socketService.socket.connected = true;
        service.connect();
        expect(connectSpy).toHaveBeenCalledTimes(0);
        expect(configureSpy).toHaveBeenCalledTimes(0);
        expect(updateSpy).toHaveBeenCalledTimes(0);
    });

    it('getter should return socket id', () => {
        service.socketService.socket.id = 'test';
        expect(service.socketId).toBe(service.socketService.socket.id);
    });

    it('getter should return empty string if no id', () => {
        expect(service.socketId).toBe('');
    });

    it('askJoin() should emit an event and set gotRefused to false', () => {
        const testGame = new Game();
        const room: Room = {
            player1: 'player1',
            player2: '',
            game: testGame,
        };
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.askJoin('test', room);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('askJoin', 'test', room);
        expect(service.gotRefused).toBeFalsy();
    });

    it('accepted() should update room and emit accepted', () => {
        const updateRoomSpy = spyOn(service, 'updateRooms');
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.accepted();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('accepted', service.socketWantToJoin, service.informationToJoin);
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('refused() should update room and emit accepted', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.refused();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('refused', service.socketWantToJoin, service.informationToJoin);
    });

    it('createRoom() should emit an event and call updateRooms()', () => {
        const updateRoomSpy = spyOn(service, 'updateRooms');
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.createRoom('test', 'testRoom', 30);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('createRoom', 'test', 'testRoom');
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('joinRoom() should emit an event and call updateRooms()', () => {
        const testGame = new Game();
        const room: Room = {
            player1: 'player1',
            player2: '',
            game: testGame,
        };
        const info: InfoToJoin = {
            username: 'username',
            roomObj: room,
        };
        service.informationToJoin = info;
        const updateRoomSpy = spyOn(service, 'updateRooms');
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.joinRoom();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('joinRoom', 'username', room);
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('sendToRoom() should call send in the socket client service set room messages to an empty string', () => {
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalled();
        expect(service.roomMessage).toBe('');
    });

    it('cancelCreation() should emit the cancelCreation event and update the rooms', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        const updateRoomSpy = spyOn(service, 'updateRooms');
        service.cancelCreation();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('cancelCreation');
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('passerTour() should call send with the skip command', () => {
        const sendSpy = spyOn(service.socketService, 'send');
        service.passerTour();
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith('passer');
    });

    describe('Receiving events', () => {
        beforeEach(() => {
            service.configureBaseSocketFeatures();
        });

        it('should handle commandValidated event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            socketTestHelper.peerSideEmit('commandValidated');
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle tileHolder event', () => {
            const letters: Tile[] = [];
            socketTestHelper.peerSideEmit('tileHolder', letters);
            expect(service.tileHolderService.tileHolder).toBe(letters);
        });

        it('should handle modification event for player1', () => {
            const board: Tile[][] = [];
            socketTestHelper.peerEmitTwoParams('modification', board, 'player1');
            expect(service.boardService.board).toBe(board);
        });

        it('should handle modification event', () => {
            const board: Tile[][] = [];
            socketTestHelper.peerSideEmit('modification', board);
            expect(service.boardService.board).toBe(board);
        });

        it('should handle roomMessage event', () => {
            const message: Message = {
                player: 'player1',
                username: 'username',
                message: 'test',
            };
            const pushSpy = spyOn(service.roomMessages, 'push');
            socketTestHelper.peerSideEmit('roomMessage', message);
            expect(pushSpy).toHaveBeenCalled();
            expect(pushSpy).toHaveBeenCalledWith(message);
        });

        /* it('should handle rooms event', () => {
            const testGame = new Game();
            const room: Room = {
                player1: 'player1',
                player2: 'player2',
                game: testGame,
            };
            socketTestHelper.peerSideEmit('rooms', room);
            expect(service.allRooms).toContain(room);
        }); */

        it('should handle didJoin event', () => {
            socketTestHelper.peerSideEmit('didJoin', true);
            expect(service.playerJoined).toBeTruthy();
        });

        it('should handle updateReserve event', () => {
            socketTestHelper.peerEmitThreeParams('updateReserve', 20, 7, 7);
            expect(service.player1ChevaletLetters).toBe(7);
            expect(service.player2ChevaletLetters).toBe(7);
            expect(service.reserve).toBe(20);
        });

        it('should handle updateReserve event', () => {
            socketTestHelper.peerEmitTwoParams('startGame', 'player1', 'player2');
            expect(service.player1Username).toBe('player1');
            expect(service.player2Username).toBe('player2');
        });

        it('should handle joining event', () => {
            const testGame = new Game();
            const room: Room = {
                player1: 'player1',
                player2: '',
                game: testGame,
            };
            const info: InfoToJoin = {
                username: 'username',
                roomObj: room,
            };
            socketTestHelper.peerSideEmit('joining', info);
            expect(service.gotAccepted).toBeTruthy();
            expect(service.informationToJoin).toBe(info);
        });

        it('should handle refusing event', () => {
            const testGame = new Game();
            const room: Room = {
                player1: 'player1',
                player2: '',
                game: testGame,
            };
            const info: InfoToJoin = {
                username: 'username',
                roomObj: room,
            };
            socketTestHelper.peerSideEmit('refusing', info);
            expect(service.gotRefused).toBeTruthy();
            expect(service.informationToJoin).toBe(info);
        });

        it('should handle asked event', () => {
            socketTestHelper.peerSideEmit('asked', 'username');
            expect(service.informationToJoin.username).toBe('username');
            expect(service.playerJoined).toBeTruthy();
        });

        it('should handle timer event', () => {
            socketTestHelper.peerSideEmit('timer', 30);
            expect(service.timer).toBe(30);
        });

        it('should handle playerDc event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            const sendSpy = spyOn(service.socketService, 'send');
            const updateSpy = spyOn(service, 'updateRooms');
            socketTestHelper.peerSideEmit('playerDc');
            expect(pushSpy).toHaveBeenCalled();
            expect(sendSpy).toHaveBeenCalled();
            expect(updateSpy).toHaveBeenCalled();
        });

        it('should handle updatePoint event and set player1 points', () => {
            socketTestHelper.peerEmitTwoParams('updatePoint', 'player1', 15);
            expect(service.player1Point).toBe(15);
        });

        it('should handle updatePoint event and set player2 points', () => {
            socketTestHelper.peerEmitTwoParams('updatePoint', 'player2', 15);
            expect(service.player2Point).toBe(15);
        });
    });
});
