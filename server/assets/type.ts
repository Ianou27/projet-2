import { Document, WithId } from 'mongodb';

export interface DictMongo extends WithId<Document> {
    title: string;
    description: string;
    words: string[];
}
