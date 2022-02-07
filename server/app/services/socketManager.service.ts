import { GameService } from '@app/classes/game.service';
import * as http from 'http';
import * as io from 'socket.io';

export class SocketManager {
    private game: GameService;
    private sio: io.Server;
    private room: string = 'serverRoom';
    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    private commandIndex: number = 0;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.game = new GameService();
    }

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
                    const isValid = this.commandVerification(message);
                    socket.emit('commandValidated', isValid);
                    if (isValid) {
                        this.game.placeWord('A', 2, 'h', 'allo');
                    }
                } else {
                    const isValid = this.lengthVerification(message) && this.characterVerification(message);
                    socket.emit('wordValidated', isValid);
                }
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

    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    lengthVerification(message: string) {
        return message.length > 512 ? false : true;
    }
    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }

    commandVerification(message: string): boolean {
        const messageArray = message.split(' ');
        return this.commandsList.includes(messageArray[this.commandIndex]) ? true : false;
    }
}
