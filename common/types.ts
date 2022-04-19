import { BotType } from './bot-type';
import { Orientation } from './orientation';
import { Tile } from './tile/Tile';

export type Room = {
    player1: string;
    player2: string;
    time: string;
    mode2990: boolean;
    dictionary: string;
};

export type InfoToJoin = {
    username: string;
    roomObj: Room;
};

export type GameHistory = {
    date: string;
    duration: number;
    player1: string;
    player1Points: number;
    player2: string;
    player2Points: number;
    gameMode: string;
};
export type Dictionary = {
    title: string;
    description: string;
    words?: string[];
};
export type User = {
    username: string;
    id: string;
    room: string;
};

export type Message = {
    player: string;
    username: string;
    message: string;
};

export type BestScore = {
    id?: string;
    player: string;
    score: number;
};

export type VirtualPlayer = {
    id?: string;
    name: string;
    type: string;
};

export type Scoring = {
    id?: string;
    player: string;
    points: number;
};

export interface TilePlacementPossible {
    tile: Tile;
    orientation: Orientation;
}

export interface PlacementScore {
    score: number;
    command: string;
}

export interface CreateRoomInformations {
    username: string;
    socketId: string;
    room: string;
    timer: string;
    modeLog: boolean;
    dictionary: string;
}

export interface CreateSoloRoomInformations {
    username: string;
    socketId: string;
    room: string;
    timer: string;
    modeLog: boolean;
    botType: BotType;
    botName: string;
    dictionary: string;
}
