// import { injectable } from 'inversify';
import { BestScore } from '@common/types';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://riad:tpUUYHQYgUZuXvgY@cluster0.pwwqd.mongodb.net/DataBase?retryWrites=true&w=majority';
const DATABASE_NAME = 'DataBase';
const DATABASE_COLLECTION = 'bestScoreClassique';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0) {
            await this.populateDB();
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        const bestScores: BestScore[] = [
            {
                player: 'Bob',
                score: 20,
            },
            {
                player: 'Jack',
                score: 18,
            },
            {
                player: 'Ian',
                score: 16,
            },
            {
                player: 'Ricky',
                score: 15,
            },
            {
                player: 'Zoro',
                score: 10,
            },
        ];

        // eslint-disable-next-line no-console
        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const bestScore of bestScores) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(bestScore);
        }
    }

    get database(): Db {
        return this.db;
    }
}
