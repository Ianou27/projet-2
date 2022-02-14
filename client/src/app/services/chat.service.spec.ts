import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
// eslint-disable-next-line no-restricted-imports
import { Tile } from '../../../../common/tile/Tile';
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

    it('can spy on id getter', () => {
        service.socketService.socket.id = 'test';
        expect(service.socketId).toBe(service.socketService.socket.id);
    });

    it('impossibleCommand() should push message', () => {
        const pushSpy = spyOn(service.serverMessages, 'push');
        service.impossibleCommand();
        expect(pushSpy).toHaveBeenCalled();
        expect(pushSpy).toHaveBeenCalledWith('Commande impossible');
    });

    it('syntaxError() should push message', () => {
        const pushSpy = spyOn(service.serverMessages, 'push');
        service.syntaxError();
        expect(pushSpy).toHaveBeenCalled();
        expect(pushSpy).toHaveBeenCalledWith('Erreur de syntaxe');
        expect(service.broadcastMessage).toBe('');
    });

    it('sendValidation() should send validate event', () => {
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendWordValidation();
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith('validate');
    });

    it('askJoin() should emit an event and set gotRefused to false', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.askJoin('test', 'testRoom');
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('askJoin', 'test', 'testRoom');
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
        service.createRoom('test', 'testRoom');
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('createRoom', 'test', 'testRoom');
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('joinRoom() should emit an event and call updateRooms()', () => {
        service.informationToJoin = {
            username: 'username',
            roomObj: 'roomObj',
        };
        const updateRoomSpy = spyOn(service, 'updateRooms');
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.joinRoom();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('joinRoom', 'username', 'roomObj');
        expect(updateRoomSpy).toHaveBeenCalled();
    });

    it('sendToRoom() should call sent in the socket client service set room messages to an empty string', () => {
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalled();
        expect(service.roomMessage).toBe('');
    });

    describe('Receiving events', () => {
        it('should handle connect event', () => {
            const consoleSpy = spyOn(console, 'log');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('connect');
            expect(consoleSpy).toHaveBeenCalled();
        });

        it('should handle wordValidated event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('wordValidated', true);
        });

        it('should handle commandValidated event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('commandValidated');
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle tileHolder event', () => {
            const letters: Tile[] = [];
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('tileHolder', letters);
            expect(service.tileHolderService.tileHolder).toBe(letters);
        });

        it('should handle placeFormatValidated event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('placeFormatValidated');
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle placeBoardValidated event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('placeBoardValidated');
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle modification event', () => {
            const board: Tile[][] = [];
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('modification', board);
            expect(service.boardService.board).toBe(board);
        });

        it('should handle roomMessage event', () => {
            const logSpy = spyOn(console, 'log');
            const pushSpy = spyOn(service.roomMessages, 'push');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('roomMessage', 'test');
            expect(logSpy).toHaveBeenCalled();
            expect(pushSpy).toHaveBeenCalled();
            expect(pushSpy).toHaveBeenCalledWith('test');
        });

        it('should handle rooms event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('rooms', 'test');
            expect(service.allRooms).toBe('test');
        });

        it('should handle didJoin event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('didJoin', true);
            expect(service.playerJoined).toBeTruthy();
        });

        it('should handle joining event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('joining', 'test');
            expect(service.gotAccepted).toBeTruthy();
            expect(service.informationToJoin).toBe('test');
        });

        it('should handle refusing event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('refusing', 'test');
            expect(service.gotRefused).toBeTruthy();
            expect(service.informationToJoin).toBe('test');
        });

        it('should handle asked event', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('asked', 'username');
            expect(service.informationToJoin.username).toBe('username');
            expect(service.playerJoined).toBeTruthy();
        });

        it('should handle playerDc event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            const sendSpy = spyOn(service.socketService, 'send');
            const updateSpy = spyOn(service, 'updateRooms');
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('playerDc');
            expect(pushSpy).toHaveBeenCalled();
            expect(sendSpy).toHaveBeenCalled();
            expect(updateSpy).toHaveBeenCalled();
        });

        /* it('should handle updatePoint event and set player1 points', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('updatePoint', 'player1', 15);
            expect(service.player1Point).toBe(15);
        });

        it('should handle updatePoint event and set player2 points', () => {
            service.configureBaseSocketFeatures();
            socketTestHelper.peerSideEmit('updatePoint', 'player2', 15);
            expect(service.player2Point).toBe(15);
        }); */
    });
});
