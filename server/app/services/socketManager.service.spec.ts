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
        service = server['socketManger'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('should handle a message event print it to console', (done) => {
        const spy = sinon.spy(console, 'log');
        const testMessage = 'Hello World';
        clientSocket.emit('message', testMessage);
        setTimeout(() => {
            assert(spy.called);
            assert(spy.calledWith(testMessage));
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a validate event and call lengthVerification and characterVerification when the message is not a command', (done) => {
        let testMessage: string = 'ABCDEFGHIJKLMNOP';
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

    it('should verify if the command exists and return true if it exists', (done) => {
        const testCommand = '!placer';
        const testCommandFalse = 'abcde';
        expect(service.commandVerification(testCommand)).to.be.true;
        expect(service.commandVerification(testCommandFalse)).to.be.false;
        done();
    });

    it('should verify if the message contains only spaces and return false', (done) => {
        const testMessageSpaces = '          ';
        expect(service.characterVerification(testMessageSpaces)).to.be.false;
        done();
    });

    it('should verify if the message is longer than 512 characters or empty and return false if it is, else return true', (done) => {
        let testMessageLong = 'ABCDEFGHIJKLMNOP';
        for (let i = 0; i < 47; i++) {
            testMessageLong += 'ABCDEFGHIJKLMNOP';
        }
        expect(service.lengthVerification(testMessageLong)).to.be.false;
        done();
    });

    it('should add the socket to the room after a join event', (done) => {
        clientSocket.emit('joinRoom');
        setTimeout(() => {
            const newRoomSize = service['sio'].sockets.adapter.rooms.get(service['room'])?.size;
            expect(newRoomSize).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('should not broadcast message to room if origin socket is not in room', (done) => {
        const testMessage = 'Hello World';
        const spy = sinon.spy(service['sio'], 'to');
        clientSocket.emit('roomMessage', testMessage);

        setTimeout(() => {
            assert(spy.notCalled);
            done();
        }, RESPONSE_DELAY);
    });

    it('should broadcast message to room if origin socket is in room', (done) => {
        const testMessage = 'Hello World';
        clientSocket.emit('joinRoom');
        clientSocket.emit('roomMessage', testMessage);

        clientSocket.on('roomMessage', (message: string) => {
            expect(message).to.contain(testMessage);
            done();
        });
    });

    it('should broadcast message to multiple clients on broadcastAll event', (done) => {
        const clientSocket2 = ioClient(urlString);
        const testMessage = 'Hello World';
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        clientSocket.emit('broadcastAll', testMessage);

        clientSocket2.on('massMessage', (message: string) => {
            expect(message).to.contain(testMessage);
            assert(spy.called);
            done();
        });
    });

    it('should broadcast to all sockets when emiting time', () => {
        const spy = sinon.spy(service['sio'].sockets, 'emit');
        service['emitTime']();
        assert(spy.called);
    });

    it('should call emitTime on socket configuration', (done) => {
        const spy = sinon.spy(service, <any>'emitTime');
        setTimeout(() => {
            assert(spy.called);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
});
