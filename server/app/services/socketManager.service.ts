import * as http from 'http';
import * as io from 'socket.io';
import { GameManager } from './gameManager.service';

export class SocketManager {
    private sio: io.Server;
    private room: string = 'serverRoom';
    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    private commandIndex: number = 0;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    gameManager: GameManager = new GameManager();

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial
            socket.emit('hello', 'Hello World!');

            socket.on('message', (message: string) => {
                console.log(message);
            });
            socket.on('validate', (message: string) => {
                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    const command = this.commandVerification(message);
                    socket.emit('commandValidated', command);
                    /* if (isValid) {
                        this.handleCommand(message.split(' '));
                        socket.emit('modification', this.gameManager.gameList.gameBoard.cases);
                    }*/
                } else {
                    const isValid = this.lengthVerification(message) && this.characterVerification(message);
                    socket.emit('wordValidated', isValid);
                }
            });

            socket.on('placeFormatVerification', (command: string) => {
                const commandFormatValid = this.placeFormatValid(command.split(' '));
                socket.emit('placeFormatValidated', commandFormatValid);
            });

            socket.on('boardVerification', (command: string) => {
                const isValid = this.placeBoardValid(command.split(' '));
                socket.emit('placeBoardValidated', isValid);
            });

            socket.on('placeWord', (command: string) => {
                this.placeWord(command.split(' '));
                socket.emit('modification', this.gameManager.gameList.gameBoard.cases);
                socket.emit('tileHolder', this.gameManager.gameList.player1.getLetters());
            });

            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });

            socket.on('joinRoom', () => {
                socket.join(this.room);
            });

            socket.on('roomMessage', (message: string) => {
                const roomSockets = this.sio.sockets.adapter.rooms.get(this.room);
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (roomSockets?.has(socket.id)) {
                    this.sio.to(this.room).emit('roomMessage', `${socket.id} : ${message}`);
                }
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });

        setInterval(() => {
            this.emitTime();
        }, 1000);
    }

    placeWord(command: string[]) {
        this.gameManager.gameList.placeWord(command);
    }

    placeBoardValid(command: string[]): boolean {
        return this.gameManager.gameList.validatedPlaceCommandBoard(command);
    }

    commandVerification(message: string): string {
        const messageArray = message.split(' ');
        for (const command of this.commandsList) {
            if (command === messageArray[this.commandIndex]) {
                return command;
            }
        }
        return 'notRecognized';
    }

    placeFormatValid(command: string[]) {
        return this.gameManager.validatedPlaceCommandFormat(command);
    }

    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }

    lengthVerification(message: string) {
        return message.length > 512 ? false : true;
    }
    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }
}
