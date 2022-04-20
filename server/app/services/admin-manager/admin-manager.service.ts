import * as io from 'socket.io';
import { DatabaseService } from './../database/database.services';
import { DictionaryManager } from './../dictionary-manager/dictionary-manager.service';

export class AdminManager {
    sio: io.Server;
    databaseService: DatabaseService;

    constructor(sio: io.Server, databaseService: DatabaseService) {
        this.sio = sio;
        this.databaseService = databaseService;
    }

    async getAdminInformations(socketId: string) {
        await this.databaseService.start();
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );

        await this.databaseService.closeConnection();
    }

    async addVirtualPlayerNames(socketId: string, name: string, type: string) {
        await this.databaseService.start();
        await this.databaseService.addVirtualPlayer(name, type);
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }

    async deleteVirtualPlayerName(socketId: string, name: string) {
        await this.databaseService.start();
        await this.databaseService.deleteVirtualPlayer(name);
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }

    async modifyVirtualPlayerNames(socketId: string, oldName: string, newName: string) {
        await this.databaseService.start();
        await this.databaseService.modifyVirtualPlayer(oldName, newName);
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }

    async resetAll(socketId: string, dictionaryManager: DictionaryManager) {
        dictionaryManager.deleteAllDictionaries();
        await this.databaseService.start();
        await this.databaseService.resetAll();
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }

    async resetGameHistory(socketId: string) {
        await this.databaseService.start();
        await this.databaseService.resetGameHistory();
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }

    async resetVirtualPlayers(socketId: string) {
        await this.databaseService.start();
        await this.databaseService.resetVirtualPlayers();
        this.sio
            .to(socketId)
            .emit(
                'getAdminInfo',
                await this.databaseService.getDictionaryInfo(),
                await this.databaseService.getGameHistory(),
                await this.databaseService.getVirtualPlayers(),
            );
        await this.databaseService.closeConnection();
    }
}
