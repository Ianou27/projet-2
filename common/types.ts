
import {Game} from '../server/app/classes/game/game'
export type Room ={
    player1:string
    player2:string
    game: Game
}

export type InfoToJoin ={
    username:string
    game: Game
}

export type User={
    username:string
    id:string
    room:string
}