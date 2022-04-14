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
