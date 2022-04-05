import { Dic } from '@common/types';
import * as fs from 'fs';
import { DatabaseService } from '../best-score/best-score.services';

export class DictionaryManager {
    databaseService: DatabaseService;
    constructor() {
        this.databaseService = new DatabaseService();
    }

    uploadDictionary(dictionary: JSON) {
        //create an object with only properties title and description of dictionary object and save it in database
        let dictObject: Dic = {
            title: dictionary['title'],
            description: dictionary['description'],
        };
        fs.writeFile('./assets/dictionaries/' + dictionary['title'] + '.json', JSON.stringify(dictionary), async (err) => {
            
            await this.databaseService.start();
            await this.databaseService.insertDictionary(dictObject);
            await this.databaseService.closeConnection();
            if (err) {
                throw err;
            }
        });
    }
}
