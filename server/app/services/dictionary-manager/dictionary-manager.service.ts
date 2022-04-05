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

    deleteDictionary(title: string) {
        fs.unlink('./assets/dictionaries/' + title + '.json', async (err) => {
            if (err) {
                throw err;
            }
            await this.databaseService.start();
            await this.databaseService.deleteDictionary(title);
            await this.databaseService.closeConnection();
        });
    }

    async modifyDictionary(oldTitle:string, newTitle:string , description:string) {

        //modifie title of json file 

        fs.rename('./assets/dictionaries/' + oldTitle + '.json', './assets/dictionaries/' + newTitle + '.json', async (err) => {
            if (err) {
                throw err;
            }

        });
        //modifie title and description in the file 

        fs.readFile('./assets/dictionaries/' + newTitle + '.json', async (err, data) => {
            if (err) {
                throw err;
            }
            let dictionary = JSON.parse(data.toString());
            dictionary['title'] = newTitle;
            dictionary['description'] = description;
            fs.writeFile('./assets/dictionaries/' + newTitle + '.json', JSON.stringify(dictionary), async (err) => {
                if (err) {
                    throw err;
                }
            });
        });
        await this.databaseService.start();
        await this.databaseService.modifyDictionary(oldTitle, newTitle, description);
        await this.databaseService.closeConnection();
    }

    downloadDictionary(title: string):string {

        //return the json file with the title of the dictionary 
        return fs.readFileSync('./assets/dictionaries/' + title + '.json').toString();
    }


}
