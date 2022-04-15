import * as io from 'socket.io';
import { DatabaseService } from './../database/database.services';

export class AdminManager {
    async getAdminInformations(sio: io.Server, databaseService: DatabaseService, socketId: string) {
        try {
            await databaseService.start();
            sio.to(socketId).emit(
                'getAdminInfo',
                await databaseService.getDictionaryInfo(),
                await databaseService.getGameHistory(),
                await databaseService.getVirtualPlayers(),
            );

            await databaseService.closeConnection();
        } catch {
            // this.sio.to(socket.id).emit(
            //     'getDictionaries',
            //     [
            //         {
            //             player: 'Accès à la BD impossible',
            //             score: 'ERREUR',
            //         },
            //     ],
            //     [
            //         {
            //             player: 'Accès à la BD impossible',
            //             score: 'ERREUR',
            //         },
            //     ],
            // );
        }
    }

    async addVirtualPlayerNames(sio: io.Server, databaseService: DatabaseService, socketId: string, name: string, type: string) {
        await databaseService.start();
        await databaseService.addVirtualPlayer(name, type);
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }

    async deleteVirtualPlayerName(sio: io.Server, databaseService: DatabaseService, socketId: string, name: string) {
        await databaseService.start();
        await databaseService.deleteVirtualPlayer(name);
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }

    async modifyVirtualPlayerNames(sio: io.Server, databaseService: DatabaseService, socketId: string, oldName: string, newName: string) {
        await databaseService.start();
        await databaseService.modifyVirtualPlayer(oldName, newName);
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }

    async resetAll(sio: io.Server, databaseService: DatabaseService, socketId: string) {
        await databaseService.start();
        await databaseService.resetAll();
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }

    async resetGameHistory(sio: io.Server, databaseService: DatabaseService, socketId: string) {
        await databaseService.start();
        await databaseService.resetGameHistory();
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }

    async resetVirtualPlayers(sio: io.Server, databaseService: DatabaseService, socketId: string) {
        await databaseService.start();
        await databaseService.resetVirtualPlayers();
        sio.to(socketId).emit(
            'getAdminInfo',
            await databaseService.getDictionaryInfo(),
            await databaseService.getGameHistory(),
            await databaseService.getVirtualPlayers(),
        );
        await databaseService.closeConnection();
    }
}
