import { Document, ObjectId, WithId } from 'mongodb';

export interface DictMongo extends WithId<Document> {
    id: ObjectId;
    title: string;
    description: string;
}

export interface Score extends WithId<Document> {
    id: ObjectId;
    player: string;
    score: number;
}

export interface History extends WithId<Document> {
    id: ObjectId;
    date: string;
    duration: string;
    player1: string;
    player1Points: number;
    player2Points: number;
    player2: string;
    gameMode: string;
}
export interface Bot extends WithId<Document> {
    id: ObjectId;
    type: string;
    name: string;
};