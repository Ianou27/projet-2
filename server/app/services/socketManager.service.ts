import * as http from 'http';
import * as io from 'socket.io';

export class SocketManager {
    private sio: io.Server;
    users:any[]=[] ;

    roomMessages:any={
        
    }; 
 
    rooms:any[]=[];
  
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


            socket.on('createRoom', (username:string,room:string) => {
                const user ={
                    username,
                    id:socket.id,
                    room
                }
                this.users.push(user);
                this.roomMessages[room]=[]; 

                const roomObj={
                    "player1":username,
                    "player2":'',

                };
                this.rooms.push(roomObj);
                console.log("----------");
                this.users.forEach(element => console.log(element));
            
                socket.join(room);
                
              
              
            });
            
            socket.on('joinRoom', (username:string,roomObj:any) => {
                
                this.rooms.forEach((element:any) =>{
    
                    if(roomObj.player1 === element.player1){
                        let room= roomObj.player1;
                        if (element.player2.length ===0){
                            const user ={
                                username,
                                id:socket.id,
                                room
                            }
                            this.users.push(user);
                            element.player2= username;
                            console.log(element);
                            socket.join(room);
                            
                          
                            this.sio.to(roomObj.player1).emit('salut', "bonsoir");
                        }

                    }
                   
                });

              
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
                   
                     
                        

                    
                    
                const roomSockets = this.sio.sockets.adapter.rooms.get(currentRoom);
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (roomSockets?.has(socket.id)) {
                    
                    this.roomMessages[currentRoom].push({username,message});
                    
                    this.sio.to(currentRoom).emit('roomMessage', this.roomMessages[currentRoom]);
                }
            });
            socket.on('updateRoom', (a) => {
              
                socket.emit('rooms',this.rooms);

            });
            socket.on('disconnect', (reason) => {
                this.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);

            });
        });

      
    }


    getID(username:string):any{
        this.users.forEach(user => {
            if(username ===user.id){
                return user.id;
            } 

            
      
        });

    }

    joined(){
        return true;
        
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

   
}
  