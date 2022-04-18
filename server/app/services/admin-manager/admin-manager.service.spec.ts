import { assert } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { DatabaseService } from './../database/database.services';
import { DictionaryManager } from './../dictionary-manager/dictionary-manager.service';
import { AdminManager } from './admin-manager.service';
describe('AdminManager', () => {
    const databaseService = new DatabaseService();
    const dictionaryManager = new DictionaryManager();
    const sio = new io.Server();
    const socketID = 'test';
    const adminManager = new AdminManager(sio, databaseService);
    beforeEach(() => {
        sinon.replace(databaseService, 'start', async () => {
            return null;
        });
        sinon.replace(databaseService, 'closeConnection', async () => {});
        sinon.replace(databaseService, 'getDictionaryInfo', async () => {
            return [];
        });
        sinon.replace(databaseService, 'getGameHistory', async () => {
            return [];
        });
        sinon.replace(databaseService, 'getVirtualPlayers', async () => {
            return [];
        });
        sinon.replace(databaseService, 'addVirtualPlayer', async () => {});
        sinon.replace(databaseService, 'deleteVirtualPlayer', async () => {});
        sinon.replace(databaseService, 'modifyVirtualPlayer', async () => {});
        sinon.replace(databaseService, 'resetAll', async () => {});
        sinon.replace(databaseService, 'resetGameHistory', async () => {});
        sinon.replace(databaseService, 'resetVirtualPlayers', async () => {});
        sinon.replace(dictionaryManager, 'deleteAllDictionaries', async () => {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should getAdminInformations', async () => {
        const getUserSpy = sinon.stub(databaseService, 'closeConnection');
        await adminManager.getAdminInformations(socketID);

        assert(getUserSpy.called);
    });

    it('should addVirtualPlayerNames', async () => {
        const getUserSpy = sinon.stub(databaseService, 'addVirtualPlayer');
        await adminManager.addVirtualPlayerNames(socketID, 'test', 'test');

        assert(getUserSpy.called);
    });

    it('should deleteVirtualPlayerName', async () => {
        const getUserSpy = sinon.stub(databaseService, 'deleteVirtualPlayer');
        await adminManager.deleteVirtualPlayerName(socketID, 'test');

        assert(getUserSpy.called);
    });

    it('should modifyVirtualPlayerNames', async () => {
        const getUserSpy = sinon.stub(databaseService, 'modifyVirtualPlayer');
        await adminManager.modifyVirtualPlayerNames(socketID, 'test', 'test');

        assert(getUserSpy.called);
    });

    it('should resetAll', async () => {
        const getUserSpy = sinon.stub(databaseService, 'resetAll');
        await adminManager.resetAll(socketID, dictionaryManager);

        assert(getUserSpy.called);
    });

    it('should resetGameHistory', async () => {
        const getUserSpy = sinon.stub(databaseService, 'resetGameHistory');
        await adminManager.resetGameHistory(socketID);

        assert(getUserSpy.called);
    });

    it('should resetVirtualPlayers', async () => {
        const getUserSpy = sinon.stub(databaseService, 'resetVirtualPlayers');
        await adminManager.resetVirtualPlayers(socketID);

        assert(getUserSpy.called);
    });
});
