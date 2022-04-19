/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
import { LetterScore } from './../../../../../common/assets/reserve-letters';
import { BotType } from './../../../../../common/bot-type';
import { GoalInformations } from './../../../../../common/constants/goal-information';
import { Tile } from './../../../../../common/tile/Tile';
import {
    CreateRoomInformations,
    CreateSoloRoomInformations,
    Dic,
    InfoToJoin,
    Message,
    Room,
    Scoring,
    VirtualPlayer,
} from './../../../../../common/types';
import { ClientSocketHandler } from './client-socket-handler.service';

describe('ChatService', () => {
    let service: ClientSocketHandler;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientSocketHandler);
        socketTestHelper = new SocketTestHelper();
        service.socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('ngOnInit should call connect', () => {
        const fakeInit = (x: number) => {
            return x;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spy = spyOn<any>(service, 'connect').and.callFake(fakeInit);
        service.init();
        expect(spy).toHaveBeenCalled();
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
        const room: Room = {
            player1: 'player1',
            player2: '',
            time: '60',
            mode2990: false,
            dictionary: 'dictionnaire',
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
        const informations: CreateRoomInformations = {
            username: 'test',
            socketId: 'test',
            room: 'testRoom',
            timer: '60',
            modeLog: false,
            dictionary: 'dictionnaire',
        };
        service.createRoom(informations);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('createRoom', informations);
        expect(updateRoomSpy).toHaveBeenCalled();
    });
    it('createSoloGame() should emit an event createSoloGame', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        const informations: CreateSoloRoomInformations = {
            username: 'test',
            socketId: 'test',
            room: 'testRoom',
            timer: '60',
            modeLog: false,
            botName: 'username',
            botType: BotType.Beginner,
            dictionary: 'dictionnaire',
        };
        service.createSoloGame(informations);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('createSoloGame', informations);
    });
    it('updateRoom() should send an event and updateRooms ', () => {
        const sendSpy = spyOn(service.socketService, 'send');
        service.updateRooms();
        expect(sendSpy).toHaveBeenCalledWith('updateRoom');
    });
    it('joinRoom() should emit an event and call updateRooms()', () => {
        const room: Room = {
            player1: 'player1',
            player2: '',
            time: '60',
            mode2990: false,
            dictionary: 'dictionnaire',
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

    it('sendToRoom() when !placer', () => {
        const command = '!placer H8v sa';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('placer', command.split(' '));
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() when !passer', () => {
        const command = '!passer';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('passer');
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() when !échanger', () => {
        const command = '!échanger aa';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('echanger', command.split(' '));
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() when !réserve', () => {
        const command = '!réserve ';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('réserve', command.split(' '));
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() when !indice', () => {
        const command = '!indice ';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('indice', command.split(' '));
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() when !aide', () => {
        const command = '!aide ';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('aide', command.split(' '));
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() if invalid command', () => {
        const command = '!resorve ';
        service.roomMessage = command;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledTimes(0);
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() if invalid nothing', () => {
        const textMessage = '';
        service.roomMessage = textMessage;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledTimes(0);
        expect(service.roomMessage).toBe('');
    });

    it('sendToRoom() if text', () => {
        const textMessage = 'Hello World';
        service.roomMessage = textMessage;
        const sendSpy = spyOn(service.socketService, 'send');
        service.sendToRoom();
        expect(sendSpy).toHaveBeenCalledWith('roomMessage', textMessage);
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

    it('convertToSoloGame() should emit the convertToSoloGame event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.convertToSoloGame(false);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('convertToSoloGame', false);
    });
    it('should update numberOfRooms without mode2990 when an empty room is added', () => {
        service.allRooms = [
            {
                player1: 'player1',
                player2: '',
                time: '60',
                mode2990: false,
                dictionary: 'dictionnaire',
            },
            {
                player1: 'player1',
                player2: '',
                time: '60',
                mode2990: true,
                dictionary: 'dictionnaire',
            },
        ];

        service.updateRoomView();

        expect(service.numberOfRoomsClassic).toBe(1);
        expect(service.numberOfRoomsLog).toBe(1);
    });

    it('addVirtualPlayerNames() should emit the addVirtualPlayerNames event', () => {
        const name = 'player';
        const type = 'beginner';
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.addVirtualPlayerNames(name, type);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('addVirtualPlayerNames', name, type);
    });

    it('deleteVirtualPlayerName() should emit the deleteVirtualPlayerName event', () => {
        const name = 'player';
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.deleteVirtualPlayerName(name);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('deleteVirtualPlayerName', name);
    });

    it('modifyVirtualPlayerNames() should emit the modifyVirtualPlayerNames event', () => {
        const name = 'player';
        const name2 = 'player';
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.modifyVirtualPlayerNames(name, name2);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('modifyVirtualPlayerNames', name, name2);
    });

    it('getAdminPageInfo() should emit the getAdminPageInfo event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.getAdminPageInfo();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('getAdminInfo');
    });

    it('resetAll() should emit the resetAll event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.resetAll();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('resetAll');
    });

    it('resetVirtualPlayers() should emit the resetVirtualPlayers event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.resetVirtualPlayers();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('resetVirtualPlayers');
    });

    it('resetDictionary() should emit the resetDictionary event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.resetDictionary();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('resetDictionary');
    });

    it('resetGameHistory() should emit the resetGameHistory event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.resetGameHistory();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('resetGameHistory');
    });

    it('resetBestScores() should emit the resetBestScores event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.resetBestScores();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('resetBestScore');
    });

    /* it('uploadDictionary() should emit the uploadDictionary event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        let file = '';
        file: JSON = JSON.parse(file);
        service.uploadDictionary(file);
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('uploadDictionary');
    }); */

    it('deleteDic() should emit the deleteDic event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.deleteDic('test');
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('deleteDic', 'test');
    });

    it('modifyDictionary() should emit the modifyDictionary event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.modifyDictionary('test', 'dictionnaire', 'dictionnaire de scrabble');
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('modifyDictionary', 'test', 'dictionnaire', 'dictionnaire de scrabble');
    });

    it('downloadDictionary() should emit the downloadDictionary event', () => {
        const emitSpy = spyOn(service.socketService.socket, 'emit');
        service.downloadDictionary('test');
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith('downloadDic', 'test');
    });

    describe('Receiving events', () => {
        beforeEach(() => {
            service.configureBaseSocketFeatures();
        });

        it('should handle reserveLetters event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            const letter = 'A';
            const reserve: LetterScore = {};
            reserve[letter] = 1;
            socketTestHelper.peerSideEmit('reserveLetters', reserve);
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle cluesMessage event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            const clues: string[] = ['', ''];
            socketTestHelper.peerSideEmit('cluesMessage', clues);
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle helpInformation event', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            const commands: string[] = ['', ''];
            socketTestHelper.peerSideEmit('helpInformation', commands);
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle commandValidated event', () => {
            const board: Tile[][] = [];
            const tileHolder: Tile[] = [];
            const pushSpy = spyOn(service.roomMessages, 'push');
            socketTestHelper.peerEmitThreeParams('commandValidated', 'hello', board, tileHolder);
            expect(pushSpy).toHaveBeenCalled();
        });

        it('should handle reserveLetters event and not push if reserve is empty', () => {
            const pushSpy = spyOn(service.roomMessages, 'push');
            socketTestHelper.peerSideEmit('reserveLetters');
            expect(pushSpy).toHaveBeenCalledTimes(0);
        });

        it('should handle tileHolder event', () => {
            const letters: Tile[] = [];
            const goalPlayer: GoalInformations[] = [];
            socketTestHelper.peerEmitTwoParams('tileHolder', letters, goalPlayer);
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

        it('should handle rooms event', () => {
            const room: Room = {
                player1: 'player1',
                player2: 'player2',
                time: '60',
                mode2990: false,
                dictionary: 'dictionnaire',
            };

            const rooms: Room[] = [];
            rooms.push(room);
            socketTestHelper.peerSideEmit('rooms', rooms);
            expect(service.allRooms).toEqual(rooms);
        });

        it('should handle turn event and update the attribute myTurn', () => {
            service.myTurn = false;
            socketTestHelper.peerSideEmit('turn', true);
            expect(service.myTurn).toBeTruthy();
        });

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

        it('should handle endGame event', () => {
            socketTestHelper.peerEmitTwoParams('endGame', 'player1');
            expect(service.gameOver).toBe(true);
            expect(service.winner).toBe('player1');
        });

        it('should handle joining event', () => {
            const room: Room = {
                player1: 'player1',
                player2: '',
                time: '60',
                mode2990: false,
                dictionary: 'dictionnaire',
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
            const room: Room = {
                player1: 'player1',
                player2: '',
                time: '60',
                mode2990: false,
                dictionary: 'dictionnaire',
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
            const updateSpy = spyOn(service, 'updateRooms');
            socketTestHelper.peerSideEmit('playerDc');
            expect(pushSpy).toHaveBeenCalled();
            expect(updateSpy).toHaveBeenCalled();
        });
        it('should handle updatePoint event and set player1 points', () => {
            service.player1Point = 0;
            service.player2Point = 0;
            socketTestHelper.peerEmitTwoParams('updatePoint', 'player1', 30);
            expect(service.player1Point).toBe(30);
        });
        it('should handle updatePoint event and set player2 points', () => {
            service.player1Point = 0;
            service.player2Point = 0;
            socketTestHelper.peerEmitTwoParams('updatePoint', 'player2', 15);
            expect(service.player2Point).toBe(15);
        });

        it('should handle getBestScore event and set both array to their own specific values', () => {
            const bestScoresClassic: Scoring[] = [
                {
                    player: 'Luffy',
                    points: 20,
                },
                {
                    player: 'Zoro',
                    points: 18,
                },
            ];
            const bestScoresLog: Scoring[] = [
                {
                    player: 'Nami',
                    points: 15,
                },
                {
                    player: 'TonyTonyChopper',
                    points: 10,
                },
            ];
            socketTestHelper.peerEmitTwoParams('getBestScore', bestScoresClassic, bestScoresLog);
            expect(service.bestClassicScores).toEqual(bestScoresClassic);
            expect(service.bestLog2990Scores).toEqual(bestScoresLog);
        });

        it('should get admin page related info', () => {
            const dictionaryNameList: Dic[] = [
                {
                    title: 'default-dictionary',
                    description: 'Description de base',
                },
            ];
            const virtualPlayerNames: VirtualPlayer[] = [
                {
                    name: 'Richard',
                    type: 'Expert',
                },
            ];
            const history: any[] = ['history'];
            socketTestHelper.peerEmitThreeParams('getAdminInfo', dictionaryNameList, history, virtualPlayerNames);
            expect(service.dictInfoList[0]).toEqual(dictionaryNameList[0]);
            expect(service.virtualPlayerNameList).toEqual(virtualPlayerNames);
            expect(service.gameHistory).toEqual(history);
        });

        it('should handle handle downloadDic', () => {
            const dictionary = 'Dictionnaire1';
            socketTestHelper.peerSideEmit('downloadDic', 'Dictionnaire1');
            expect(service.dictionaryToDownload).toEqual(dictionary);
        });
    });
});
