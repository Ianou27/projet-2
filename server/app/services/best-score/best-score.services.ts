// import { injectable } from 'inversify';
import { INDEX_OF_NOT_FOUND, NUMBER_ELEMENTS_DATABASE } from '@common/constants/general-constants';
import { BestScore, GameHistory } from '@common/types';
import * as fs from 'fs';
import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { BEGINNER_BOT, EXPERT_BOT } from '../../../assets/bot-name';
// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://riad:tpUUYHQYgUZuXvgY@cluster0.pwwqd.mongodb.net/DataBase?retryWrites=true&w=majority';
const DATABASE_NAME = 'DataBase';
const DATABASE_COLLECTION_CLASSIC = 'bestScoreClassic';
const DATABASE_COLLECTION_LOG = 'bestScoreLog2990';
const DATABASE_COLLECTION_DIC = 'dictionnaire';
const DATABASE_COLLECTION_GAME = 'game';
const DATABASE_COLLECTION_VIRTUAL = 'joueurVirtuels';

@Service()
export class DatabaseService {
    db: Db;
    client: MongoClient;

    dictionaryArray: JSON = JSON.parse(fs.readFileSync('./assets/dictionnary.json').toString());
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
    //score Handler
    async bestScoreClassic(): Promise<any[]> {
        return await this.db.collection(DATABASE_COLLECTION_CLASSIC).find().sort({ score: -1 }).toArray();
    }

    async bestScoreLog(): Promise<any[]> {
       
        await this.modifyName('george','Richard');
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
    //Dic handler
    async getDictionary(): Promise<any[]> {
        return await this.db.collection(DATABASE_COLLECTION_DIC).find().toArray();
    }

    async insertDictionary(json: JSON) {
        await this.db.collection(DATABASE_COLLECTION_DIC).insertOne(json);
    }

    async deleteDictionary(title: string) {
        await this.db.collection(DATABASE_COLLECTION_DIC).deleteOne({ title: title });
    }
    //game Handler

    async insertGame(game: GameHistory) {
        await this.db.collection(DATABASE_COLLECTION_GAME).insertOne(game);
    }

    async getGameHistory(): Promise<any[]> {
        return await this.db.collection(DATABASE_COLLECTION_GAME).find().toArray();
    }
    //VirtualPlayer Handler

    async getVirtualPlayers() {
        return await this.db.collection(DATABASE_COLLECTION_VIRTUAL).find().toArray();
    }

    async deleteVirtualPlayer(name: string) {
        
        if (EXPERT_BOT.includes(name) || BEGINNER_BOT.includes(name)) {
            return;
        }

        await this.db.collection(DATABASE_COLLECTION_VIRTUAL).deleteOne({ name: name });

    }

    
    async addVirtualPlayer(name: string, type: string) {
        const db = await this.db.collection(DATABASE_COLLECTION_VIRTUAL).find().toArray();
        if (!db.some((player) => player.name === name)) {
            await this.db.collection(DATABASE_COLLECTION_VIRTUAL).insertOne({ name: name, type: type });
        }
    }

  

    async modifyName(oldName: string, newName: string) {

        if (EXPERT_BOT.includes(oldName) || BEGINNER_BOT.includes(oldName) || EXPERT_BOT.includes(newName) || BEGINNER_BOT.includes(newName)) {

            return;
        }
        const db = await this.db.collection(DATABASE_COLLECTION_VIRTUAL).find().toArray();
        if (db.some((player) => player.name === oldName)) {
            await this.db.collection(DATABASE_COLLECTION_VIRTUAL).updateOne({ name: oldName }, { $set: { name: newName } });
        }

    }
}
