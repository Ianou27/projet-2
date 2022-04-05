import * as fs from 'fs';
import { DatabaseService } from '../best-score/best-score.services';

export class DictionaryManager {
    databaseService: DatabaseService;
    constructor() {
        this.databaseService = new DatabaseService();
    }

    uploadDictionary(dictionary: JSON) {
        

        fs.writeFile('./assets/dictionaries/' + dictionary['title'] + '.json', JSON.stringify(dictionary), (err) => {
            if (err) {
                throw err;
            }
        });
    }
}
