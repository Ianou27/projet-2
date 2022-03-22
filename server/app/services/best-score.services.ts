// import { injectable } from 'inversify';
import { INDEX_OF_NOT_FOUND, NUMBER_ELEMENTS_DATABASE } from '@common/constants/general-constants';
import { BestScore } from '@common/types';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://riad:tpUUYHQYgUZuXvgY@cluster0.pwwqd.mongodb.net/DataBase?retryWrites=true&w=majority';
const DATABASE_NAME = 'DataBase';
const DATABASE_COLLECTION_CLASSIC = 'bestScoreClassic';
const DATABASE_COLLECTION_LOG = 'bestScoreLog2990';
@Service()
export class DatabaseService {
    db: Db;
    client: MongoClient;

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.db.collection(DATABASE_COLLECTION_CLASSIC).countDocuments()) === 0) {
            await this.populateDB(DATABASE_COLLECTION_CLASSIC);
        }
        if ((await this.db.collection(DATABASE_COLLECTION_LOG).countDocuments()) === 0) {
            await this.populateDB(DATABASE_COLLECTION_LOG);
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        try {
            return this.client.close();
        } catch (error) {
            return;
        }
    }

    async populateDB(collection: string): Promise<void> {
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
            await this.db.collection(collection).insertOne(bestScore);
        }
    }

    async bestScoreClassic(): Promise<Record<string, unknown>[]> {
        return await this.db.collection(DATABASE_COLLECTION_CLASSIC).find().sort({ score: -1 }).toArray();
    }

    async bestScoreLog(): Promise<Record<string, unknown>[]> {
        return await this.db.collection(DATABASE_COLLECTION_LOG).find().sort({ score: -1 }).toArray();
    }

    async updateBesScoreClassic(score: BestScore) {
        const db = await this.db.collection(DATABASE_COLLECTION_CLASSIC).find().sort({ score: -1 }).toArray();
        let index = -1;
        for (let i = 0; i < NUMBER_ELEMENTS_DATABASE; i++) {
            if (db[i].score <= score.score) {
                index = i;
                break;
            }
        }

        if (index !== INDEX_OF_NOT_FOUND) {
            const player = db[index].player.split('-');
            if (db[index].score === score.score && !player.includes(score.player)) {
                await this.db
                    .collection(DATABASE_COLLECTION_CLASSIC)
                    .updateOne({ score: db[index].score }, { $set: { player: db[index].player + '-' + score.player } });
            } else if (db[index].score < score.score) {
                await this.db
                    .collection(DATABASE_COLLECTION_CLASSIC)
                    .replaceOne({ score: db[4].score }, { player: score.player, score: score.score });
            }
        }
    }
}
