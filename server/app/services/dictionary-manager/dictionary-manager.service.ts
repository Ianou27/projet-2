import { Dictionary } from '@common/types';
import * as fs from 'fs';
import * as io from 'socket.io';
import { DatabaseService } from './../database/database.services';

export class DictionaryManager {
    databaseService: DatabaseService;
    constructor() {
        this.databaseService = new DatabaseService();
    }

    async uploadDictionary(sio: io.Server, socketId: string, dictionary: Dictionary) {
        await this.databaseService.start();
        const dictObject: Dictionary = {
            title: dictionary.title,
            description: dictionary.description,
        };
        fs.writeFile('./assets/dictionaries/' + dictionary.title + '.json', JSON.stringify(dictionary), async () => {
           
        });
        await this.databaseService.insertDictionary(dictObject);
        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }

    async deleteDictionary(title: string, sio: io.Server, socketId: string) {
        await this.databaseService.start();
        fs.unlink('./assets/dictionaries/' + title + '.json', async () => {
            
        });
        await this.databaseService.deleteDictionary(title);
        sio.to(socketId).emit(
            'getAdminInfo',
            await this.databaseService.getDictionaryInfo(),
            await this.databaseService.getGameHistory(),
            await this.databaseService.getVirtualPlayers(),
        );
        await this.databaseService.closeConnection();
    }

    async deleteAllDictionaries() {
        const files = fs.readdirSync('./assets/dictionaries/');
        for (const file of files) {
            if (file !== 'default-dictionary.json') {
                fs.unlinkSync('./assets/dictionaries/' + file);
            }
        }
    }

    async modifyDictionary(oldTitle: string, newTitle: string, description: string, sio: io.Server, socketId: string) {
        await this.databaseService.start();
        await fs.rename('./assets/dictionaries/' + oldTitle + '.json', './assets/dictionaries/' + newTitle + '.json', async () => {
            
        });

        await fs.readFile('./assets/dictionaries/' + newTitle + '.json', async (err, data) => {
           
            const dictionary = JSON.parse(data.toString());
            dictionary.title = newTitle;
            dictionary.description = description;
            await fs.writeFile('./assets/dictionaries/' + newTitle + '.json', JSON.stringify(dictionary), async () => {
                
            });
        });

        await this.databaseService.modifyDictionary(oldTitle, newTitle, description);

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
        this.deleteAllDictionaries();
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
