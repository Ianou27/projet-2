
export type Room = {
    player1: string;
    player2: string;

};

export type InfoToJoin = {
    username: string;
    roomObj: Room;
};

export type User = {
    username: string;
    id: string;
    room: string;
};

export type Message ={
    player:string
    username: string
    message:string

};
