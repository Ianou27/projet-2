import * as http from 'http';
import * as io from 'socket.io';

export class SocketManager {
    private sio: io.Server;
    users:any[]=[] ;

    roomMessages:any={
       
    };

    rooms:string[]=[];
    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    private commandIndex: number = 0;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial
            

            socket.on('validate', (message: string) => {
                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    socket.emit('commandValidated', this.commandVerification(message));
                } else {
                    const isValid = this.lengthVerification(message) && this.characterVerification(message);
                    socket.emit('wordValidated', isValid);
                }
            });


            socket.on('joinRoom', (username,room:string) => {
                const user ={
                    username,
                    id:socket.id,
                    room
                }
                this.users.push(user);
                console.log("----------");
                this.users.forEach(element => console.log(element));

                socket.join(room);
            });

            socket.on('roomMessage', (message: string) => {
                let username ='';
                    let currentRoom:any ='';
                    this.users.forEach(element => {
                        if(element.id ===socket.id){
                            username=element.username;
                            currentRoom = element.room;
                        }
            
                        
                  
                    });
                    if(!(this.roomMessages.hasOwnProperty(currentRoom))){
                     
                        this.roomMessages[currentRoom]=[]; 

                    }
                    
                const roomSockets = this.sio.sockets.adapter.rooms.get(currentRoom);
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (roomSockets?.has(socket.id)) {
                    
                    this.roomMessages[currentRoom].push({username,message});
                    
                    this.sio.to(currentRoom).emit('roomMessage', this.roomMessages[currentRoom]);
                }
            });
            socket.on('updateRoom', (a) => {
                this.updateRoom();
                socket.emit('rooms',this.rooms);

            });
            socket.on('disconnect', (reason) => {
                this.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);

            });
        });

      
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

    deleteUser(socketId:any){
        this.users.forEach(element => {
            if(element.id ===socketId){
                let index= this.users.indexOf(element);
                this.users.splice(index, 1);
            }
        })
        
    }

    updateRoom(){
        let isIn=false;
        this.users.forEach(user => {
            this.rooms.forEach(room => {
                if(user.room === room){
                    isIn=true;
                }
            
            })
            if(!isIn){
                this.rooms.push(user.room);
            }
        })
 

        console.log(this.rooms);
       
       
}
}
  