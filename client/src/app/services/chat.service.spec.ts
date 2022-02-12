import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
// import { Server } from '../../../../server/app/server';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatService);
        service.socketService.socket = new SocketTestHelper() as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('can spy on id getter', () => {
        service.socketService.socket.id = 'test';
        expect(service.socketId).toBe(service.socketService.socket.id);
    });

    /* it('should assign socket, set a value for playerJoined and set info on asked', () => {
    // const logSpy = spyOn(console, 'log');
    const username = 'user';
    const socket = 'testSocket';
    const room = 'testRoom';
    const event = 'asked';
    service.socketService.on(event, (username, socket, room) => {
        this.socketWantToJoin = socket;
        this.playerJoined=true;

        this.informationToJoin={
            username,
            roomObj
        }
    });
    expect(service.playerJoined).toBeTruthy();
}); */

    it('impossibleCommand() should send validate event', () => {
        const pushSpy = spyOn(service.serverMessages, 'push');
        service.impossibleCommand();
        expect(pushSpy).toHaveBeenCalled();
        expect(pushSpy).toHaveBeenCalledWith('Commande impossible');
    });

    it('syntaxError() should send validate event', () => {
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
});
