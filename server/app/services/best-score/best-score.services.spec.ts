/* eslint-disable @typescript-eslint/no-magic-numbers */
import { fail } from 'assert';
// import * as chai from 'chai';
import { expect } from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
// import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './best-score.services';
// chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

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
});
