import { Dic } from '@common/types';
import * as fs from 'fs';
import * as io from 'socket.io';
import { DatabaseService } from './../database/database.services';

export class DictionaryManager {
    databaseService: DatabaseService;
    constructor() {
        this.databaseService = new DatabaseService();
    }

    async uploadDictionary(sio: io.Server, socketId: string, dictionary: Dic) {
        const dictObject: Dic = {
            title: dictionary.title,
            description: dictionary.description,
        };
        fs.writeFile('./assets/dictionaries/' + dictionary.title + '.json', JSON.stringify(dictionary), async (err) => {
            await this.databaseService.start();
            await this.databaseService.insertDictionary(dictObject);
            await this.databaseService.closeConnection();
            if (err) {
                throw err;
            }
        });
        await this.databaseService.start();
        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }

    async deleteDictionary(title: string, sio: io.Server, socketId: string) {
        fs.unlink('./assets/dictionaries/' + title + '.json', async (err) => {
            if (err) {
                throw err;
            }
            await this.databaseService.start();
            await this.databaseService.deleteDictionary(title);
            await this.databaseService.closeConnection();
        });
        await this.databaseService.start();
        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }

    async modifyDictionary(oldTitle: string, newTitle: string, description: string, sio: io.Server, socketId: string) {
        console.log(oldTitle, newTitle, description);
        await fs.rename('./assets/dictionaries/' + oldTitle + '.json', './assets/dictionaries/' + newTitle + '.json', async (err) => {
            if (err) {
                throw err;
            }
        });

        await fs.readFile('./assets/dictionaries/' + newTitle + '.json', async (err, data) => {
            if (err) {
                throw err;
            }
            const dictionary = JSON.parse(data.toString());
            dictionary.title = newTitle;
            dictionary.description = description;
            await fs.writeFile('./assets/dictionaries/' + newTitle + '.json', JSON.stringify(dictionary), async (error) => {
                if (error) {
                    throw error;
                }
            });
        });

        await this.databaseService.start();
        await this.databaseService.modifyDictionary(oldTitle, newTitle, description);
        await this.databaseService.closeConnection();

        await this.databaseService.start();

        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }

    downloadDictionary(title: string): string {
        return fs.readFileSync('./assets/dictionaries/' + title + '.json').toString();
    }

    async resetDictionary(sio: io.Server, socketId: string) {
        await this.databaseService.start();
        await this.databaseService.resetDictionary();
        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }
}
