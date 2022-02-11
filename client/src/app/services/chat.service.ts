import { Injectable } from '@angular/core';
import { Tile } from './../../../../common/tile/Tile';
import { BoardService } from './board.service';
import { SocketClientService } from './socket-client.service';
import { TileHolderService } from './tile-holder/tile-holder.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {


    //vrai
    username = '';
    room = '';
    allRooms: any[] = [];
    roomMessage = '';
    roomMessages: any[] = [];
    playerJoined: boolean =false;
    socketWantToJoin: any;
    informationToJoin: any;
    gotAccepted: boolean = false;
    gotRefused: boolean = false;

    //
    serverMessage: string = '';
    serverClock: Date;

    wordInput = '';
    serverValidationResult = '';
    messageToServer = '';

    broadcastMessage = '';
    serverMessages: string[] = [];
    // lastCommandProcessed: string;
    constructor(public socketService: SocketClientService, public boardService: BoardService, public tileHolderService: TileHolderService) {}

    get socketId() {
        return this.socketService.socket.id ? this.socketService.socket.id : '';
    }

    ngOnInit(): void {
        this.connect();
    }

    connect() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
            this.configureBaseSocketFeatures();
            //enplus
            this.updateRooms();
        }
    }

    configureBaseSocketFeatures() {
        this.socketService.on('connect', () => {
            console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
        });

        // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
        this.socketService.on('wordValidated', (isValid: boolean) => {
            isValid ? this.broadcastMessageToAll() : this.messageLengthError();
        });

        this.socketService.on('commandValidated', (command: string) => {
            // this.lastCommandProcessed = this.broadcastMessage;
            if (command === '!placer') this.socketService.send('placeFormatVerification', this.broadcastMessage);
            /*
            Il y aura les autres conditions ici
            */
        });

        this.socketService.on('tileHolder', (letters: Tile[]) => {
            this.tileHolderService.tileHolder = letters;
        });

        this.socketService.on('placeFormatValidated', (isValid: boolean) => {
            if (isValid) {
                this.socketService.send('boardVerification', this.broadcastMessage);
            } else {
                this.syntaxError();
            }
            // isValid ? this.socketService.send('boardVerification', this.broadcastMessage) : this.syntaxError();
        });

        this.socketService.on('placeBoardValidated', (isValid: boolean) => {
            if (isValid) {
                this.socketService.send('placeWord', this.broadcastMessage);
            } else {
                this.impossibleCommand();
            }
            // isValid ? this.socketService.send('placeWord', this.broadcastMessage) : this.impossibleCommand();
        });

        this.socketService.on('modification', (updatedBoard: Tile[][]) => {
            this.boardService.board = updatedBoard;
            this.broadcastMessageToAll();
        });

        //vrai
        this.socketService.on('roomMessage', (roomMessage: string[]) => {
            this.roomMessages = roomMessage;        
        });

        this.socketService.on('rooms', (rooms: any[]) => {
            this.allRooms = rooms;
            
        });

        this.socketService.on('didJoin', (didJoin : boolean) => {
            this.playerJoined = didJoin;
         
  
            
        });

        this.socketService.on('joining', (obj : any) => {
            this.gotAccepted = true;
            this.informationToJoin = obj;
        });

        this.socketService.on('refusing', (obj : any) => {
            
            this.informationToJoin = obj;
            this.gotRefused = true;

            
         
  
            
        });
        this.socketService.socket.on('asked', (username:string,socket:any,roomObj:any) => {
            
            this.socketWantToJoin = socket;
            this.playerJoined=true;
    
            this.informationToJoin={
                username,
                roomObj
            }

            
  
            
        });

    }

    impossibleCommand() {
        this.serverMessages.push('Commande impossible');
        this.broadcastMessage = '';
    }

    syntaxError() {
        this.serverMessages.push('Erreur de syntaxe');
        this.broadcastMessage = '';
    }
    updateRooms() { 
        this.socketService.send('updateRoom', this.allRooms);
    }
    askJoin(username:string, room:any){
        this.socketService.socket.emit('askJoin', username, room);
        this.gotRefused =false;
    }
 
    accepted(){

        this.socketService.socket.emit('accepted', this.socketWantToJoin, this.informationToJoin);
        this.updateRooms();
    }

    refused(){
        this.socketService.socket.emit('refused', this.socketWantToJoin, this.informationToJoin);
    }
 
    createRoom(username: string, room: string) {
       
        this.socketService.socket.emit( 'createRoom', username, room);
        this.updateRooms();
         
    }

    joinRoom(){
     
        
        this.socketService.socket.emit('joinRoom', this.informationToJoin.username,this.informationToJoin.roomObj);
        this.updateRooms();
        
    }
   
    sendToRoom() {
        this.socketService.send('roomMessage', this.roomMessage);
        this.roomMessage = '';
    }

    sendWordValidation() {
        this.socketService.send('validate', this.broadcastMessage);
    }

    sendToServer() {
        this.socketService.send('message', this.messageToServer);
        this.messageToServer = '';
    }

    broadcastMessageToAll() {
        this.socketService.send('broadcastAll', this.broadcastMessage);
        this.broadcastMessage = '';
    }


    messageLengthError() {
        this.serverMessages.push('Votre message est trop long');
        this.broadcastMessage = '';
    }

    commandError(): void {
        this.serverMessages.push('Commande non reconnue');
        this.broadcastMessage = '';
    }
}
