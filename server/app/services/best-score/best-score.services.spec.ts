/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Dic } from '@common/types';
import { fail } from 'assert';
// import * as chai from 'chai';
import { expect } from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
// import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './best-score.services';
describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const dictionary: Dic = {
        title: 'Mon dictionnaire',
        description: 'Description de mon dictionnaire',
    };
    const dictionaryTest: Dic = {
        title: 'Mon dictionnaire test',
        description: 'Description de mon dictionnaire test',
    };
    beforeEach(async () => {
        databaseService = new DatabaseService();

        mongoServer = new MongoMemoryServer();
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should connect to the database when start is called', async () => {
        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService.client).to.not.equal(undefined);
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            expect(databaseService.client).to.equal(undefined);
        }
    });

    it('bestScoreClassic should return classic Score', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreClassic');
        const scores = await databaseService.bestScoreClassic();
        expect(scores.length).to.equal(5);
    });

    it('bestScoreLog should return Log Score', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreLog2990');
        const scores = await databaseService.bestScoreLog();
        expect(scores.length).to.equal(5);
    });

    it(' should updateScore if its equal', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreClassic');
        await databaseService.updateBesScoreClassic({
            player: 'test',
            score: 10,
        });
        const scores = await databaseService.bestScoreClassic();
        expect(scores[4]).to.contain({
            player: 'Zoro-test',
            score: 10,
        });
    });
    it(' should updateScore if lesser', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreClassic');
        await databaseService.updateBesScoreClassic({
            player: 'test1',
            score: 11,
        });
        const scores = await databaseService.bestScoreClassic();
        expect(scores[4]).to.contain({
            player: 'test1',
            score: 11,
        });
    });
    it(' should getDictionary', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertDictionary(dictionary);
        const dic = await databaseService.getDictionary();
        expect(dic.length).to.equal(1);
    });

    it(' should getDictionaryInfo', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertDictionary(dictionary);
        const dic = await databaseService.getDictionaryInfo();
        expect(dic[0].title).to.equal('Mon dictionnaire');
    });

    it(' should deleteDic', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertDictionary(dictionary);
        await databaseService.deleteDictionary('Mon dictionnaire');
        const dic = await databaseService.getDictionary();
        expect(dic.length).to.equal(0);
    });

    it(' should get historyGame', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertGame({
            date: new Date().toString(),
            duration: '10',
            player1: 'test',
            player1Points: 60,
            player2: 'test2',
            player2Points: 20,
            gameMode: 'classic',
        });
        const history = await databaseService.getGameHistory();

        expect(history.length).to.equal(1);
    });

    it(' should add Virtual Player and get it', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('george', 'expert');
        const players = await databaseService.getVirtualPlayers();

        expect(players.length).to.equal(1);
    });
    it(' should delete Virtual Player', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('george', 'expert');
        await databaseService.addVirtualPlayer('test', 'expert');
        await databaseService.deleteVirtualPlayer('test');
        const players = await databaseService.getVirtualPlayers();
        expect(players.length).to.equal(1);
    });

    it(' should not delete Virtual Player', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('Felix', 'expert');
        await databaseService.deleteVirtualPlayer('Felix');
        const players = await databaseService.getVirtualPlayers();
        expect(players.length).to.equal(1);
    });

    it(' should modify Virtual Player', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('george', 'expert');
        await databaseService.modifyVirtualPlayer('george', 'test');
        const players = await databaseService.getVirtualPlayers();
        expect(players[0].name).to.equal('test');
    });

    it(' should not modify Virtual Player', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('Felix', 'expert');
        await databaseService.modifyVirtualPlayer('Felix', 'test');
        const players = await databaseService.getVirtualPlayers();
        expect(players[0].name).not.to.equal('test');
    });

    it(' should Reset Virtual Player', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.addVirtualPlayer('Felix', 'expert');
        await databaseService.addVirtualPlayer('test', 'expert');
        await databaseService.resetVirtualPlayers();
        const players = await databaseService.getVirtualPlayers();
        expect(players.length).to.equal(1);
    });

    it(' should Reset historyGame', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertGame({
            date: new Date().toString(),
            duration: '10',
            player1: 'test',
            player1Points: 60,
            player2: 'test2',
            player2Points: 20,
            gameMode: 'classic',
        });

        await databaseService.resetGameHistory();
        const history = await databaseService.getGameHistory();

        expect(history.length).to.equal(0);
    });

    it(' should reset Dictionary', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.insertDictionary(dictionary);
        await databaseService.insertDictionary(dictionaryTest);
        await databaseService.resetDictionary();
        const dic = await databaseService.getDictionary();
        expect(dic.length).to.equal(1);
    });
    it(' should reset updateScore ', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreClassic');
        await databaseService.updateBesScoreClassic({
            player: 'test1',
            score: 11,
        });
        await databaseService.resetBestScores();
        const scores = await databaseService.bestScoreClassic();
        expect(scores[4]).to.not.contain({
            player: 'test1',
            score: 11,
        });
    });

    it(' should resetAll ', async () => {
        const mongoUri = await mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri);
        databaseService.db = client.db('Database');
        await databaseService.populateDB('bestScoreClassic');
        await databaseService.updateBesScoreClassic({
            player: 'test1',
            score: 11,
        });

        await databaseService.addVirtualPlayer('george', 'expert');
        await databaseService.insertDictionary(dictionary);
        await databaseService.insertGame({
            date: new Date().toString(),
            duration: '10',
            player1: 'test',
            player1Points: 60,
            player2: 'test2',
            player2Points: 20,
            gameMode: 'classic',
        });

        await databaseService.resetAll();
        const dic = await databaseService.getDictionary();
        const scores = await databaseService.bestScoreClassic();
        const history = await databaseService.getGameHistory();
        const players = await databaseService.getVirtualPlayers();

        expect(dic.length).to.equal(0);

        expect(history.length).to.equal(0);

        expect(players.length).to.equal(0);
        expect(scores.length).to.equal(5);
    });
});
