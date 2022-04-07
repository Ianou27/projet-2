// /* eslint-disable @typescript-eslint/no-magic-numbers */
// import { Game } from '@app/classes/game/game';
// import { Player } from '@app/classes/player/player';
// import { IdManager } from '@app/services/id-manager/id-manager.service';
// import { Room } from '@common/types';
// import { expect } from 'chai';
// import * as sinon from 'sinon';
// import * as io from 'socket.io';
// import { Timer } from './timer-manager.service';

// describe('Timer Manager tests', () => {
//     const timer = new Timer('60');
//     const idManager = new IdManager();
//     const game = new Game();
//     const sio = new io.Server();
//     // const gameManager = new GameManager();

//     beforeEach(() => {
//         timer.timeLeft = 60;
//     });

//     afterEach(() => {
//         idManager.users.forEach(() => {
//             idManager.users.pop();
//         });
//         idManager.rooms.forEach(() => {
//             idManager.rooms.pop();
//         });
//         sinon.restore();
//     });

//     it('start should do nothing if time is -1', (done) => {
//         timer.timeLeft = -1;
//         timer.start(game, sio);
//         // eslint-disable-next-line @typescript-eslint/no-empty-function
//         setTimeout(() => {
//             done();
//         }, 1200);
//     });

//     it('start should start counting down and emit the time', (done) => {
//         const user1 = {
//             username: 'player1',
//             id: 'a',
//             room: 'room1',
//         };
//         const user2 = {
//             username: 'player2',
//             id: 'b',
//             room: 'room1',
//         };
//         game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
//         game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', user2);
//         const room: Room = {
//             player1: 'player1',
//             player2: 'player2',
//             time: '60',
//         };
//         idManager.users.push(user1);
//         idManager.users.push(user2);
//         idManager.rooms.push(room);
//         timer.timeLeft = 1;
//         // eslint-disable-next-line @typescript-eslint/no-empty-function
//         sinon.replace(game, 'passTurn', () => {});
//         timer.start(game, sio);
//         setTimeout(() => {
//             expect(timer.timeLeft).to.equal(60);
//             done();
//         }, 1000);
//     });

//     it('start should start counting down and emit the time', (done) => {
//         const user1 = {
//             username: 'player1',
//             id: 'a',
//             room: 'room1',
//         };
//         const user2 = {
//             username: 'player2',
//             id: 'b',
//             room: 'room1',
//         };
//         game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', user1);
//         game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', user2);
//         const room: Room = {
//             player1: 'player1',
//             player2: 'player2',
//             time: '60',
//         };
//         idManager.users.push(user1);
//         idManager.users.push(user2);
//         idManager.rooms.push(room);
//         // eslint-disable-next-line @typescript-eslint/no-empty-function
//         sinon.replace(game, 'passTurn', () => {});
//         timer.start(game, sio);
//         setTimeout(() => {
//             expect(timer.timeLeft).to.equal(59);
//             done();
//         }, 975);
//     });

//     it('start reset the timer when it goes below -1', () => {
//         timer.timeLeft = -2;
//         timer.reset();
//         expect(timer.timeLeft).to.equal(timer.timerMax);
//     });

//     it('reset should set time left to 60', () => {
//         timer.reset();
//         expect(timer.timeLeft).to.equal(60);
//     });

//     it('stop should set time left to 60', () => {
//         timer.stop();
//         expect(timer.timeLeft).to.equal(-1);
//     });
// });
