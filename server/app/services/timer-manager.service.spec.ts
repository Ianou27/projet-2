/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Game } from '@app/classes/game/game';
import { IdManager } from '@app/services/id-manager.service';
import { Room, User } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { GameManager } from './game-manager.service';
import { Timer } from './timer-manager.service';

describe('IdManager tests', () => {
    const timer = new Timer('60');
    const idManager = new IdManager();
    const game = new Game();
    const sio = new io.Server();
    const gameManager = new GameManager();

    beforeEach(() => {
        timer.timeLeft = 60;
    });

    afterEach(() => {
        idManager.users.forEach(() => {
            idManager.users.pop();
        });
        idManager.rooms.forEach(() => {
            idManager.rooms.pop();
        });
    });

    it('start should do nothing if time is -1', (done) => {
        timer.timeLeft = -1;
        timer.start(game, sio);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setTimeout(() => {}, 1200);
        done();
    });

    it('start should start counting down and emit the time', (done) => {
        const room: Room = {
            player1: 'username',
            player2: 'player2',
            time: '60',
        };
        const user: User = {
            username: 'username',
            id: 'id',
            room: 'room',
        };
        idManager.users.push(user);
        idManager.rooms.push(room);
        timer.start(game, sio);
        setTimeout(() => {
            expect(timer.timeLeft).to.equal(59);
        }, 1001);
        done();
    });

    it('start reset the timer when it goes below -1', (done) => {
        timer.timeLeft = -2;
        const passSpy = sinon.stub(gameManager, 'pass');
        timer.start(game, sio);
        setTimeout(() => {
            assert(passSpy.called);
            expect(timer.timeLeft).to.equal(60);
        }, 1001);
        done();
    });

    it('start should call getUsername and getRoom', () => {
        const userSpy = sinon.spy(idManager, 'getUsername');
        const roomSpy = sinon.spy(idManager, 'getRoom');
        timer.start(game, sio);
        assert(userSpy.called);
        assert(roomSpy.called);
    });

    it('reset should set time left to 60', () => {
        timer.reset();
        expect(timer.timeLeft).to.equal(60);
    });

    it('stop should set time left to 60', () => {
        timer.stop();
        expect(timer.timeLeft).to.equal(-1);
    });
});
