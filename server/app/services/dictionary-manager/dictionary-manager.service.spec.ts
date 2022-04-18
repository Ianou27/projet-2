import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { DictionaryManager } from "./dictionary-manager.service";
import * as fs from 'fs';
import { Dic } from '@common/types';



describe('DictionaryManager', () => {
    const dictionaryManager = new DictionaryManager();
    const sio = new io.Server();
    const socketID ='test';
    const dictionary:Dic = {
        title: 'test',
        description: 'test',
    };
  
    beforeEach(() => {
        sinon.replace(dictionaryManager.databaseService, 'start', async () => {return  null});
        sinon.replace(dictionaryManager.databaseService, 'closeConnection', async() => {});
        sinon.replace(dictionaryManager.databaseService, 'getDictionaryInfo', async() => {return []});
        sinon.replace(dictionaryManager.databaseService, 'getGameHistory', async() => {return []});
        sinon.replace(dictionaryManager.databaseService, 'getVirtualPlayers', async() => {return []});
        sinon.replace(dictionaryManager.databaseService, 'insertDictionary', async() => {});
        sinon.replace(dictionaryManager.databaseService, 'deleteDictionary', async() => {});
        sinon.replace(dictionaryManager.databaseService, 'modifyDictionary', async() => {});
        sinon.replace(dictionaryManager.databaseService, 'resetDictionary', async() => {});
    });

    afterEach(() => {
        if (fs.existsSync('./assets/dictionaries/test.json')) {
           fs.unlinkSync('./assets/dictionaries/test.json');
        }
        sinon.restore();
    });
    it('should upload a dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        
        expect( fs.existsSync('./assets/dictionaries/' + dictionary.title + '.json')).to.be.true;
       
    });

    it('should delete a dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        await dictionaryManager.deleteDictionary(dictionary.title, sio, socketID);
        expect( fs.existsSync('./assets/dictionaries/' + dictionary.title + '.json')).to.be.false;
       
    });

    it('should delete all dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        await dictionaryManager.deleteAllDictionaries();
        expect( fs.existsSync('./assets/dictionaries/' + dictionary.title + '.json')).to.be.false;
       
    });

    it('should modify  dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        await dictionaryManager.modifyDictionary( 'test', 'test', 'test', sio, socketID);
        
        expect( fs.existsSync('./assets/dictionaries/' + 'test' + '.json')).to.be.false;

       
    });

    it('should download  dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        const dic =dictionaryManager.downloadDictionary(dictionary.title);
        

        expect( dic).to.equal('');

       
    });
    it('should resetAll  dictionary', async () => {
        
        
        await dictionaryManager.uploadDictionary(sio, socketID, dictionary);
        await dictionaryManager.resetDictionary( sio, socketID);
        expect( fs.existsSync('./assets/dictionaries/' + dictionary.title + '.json')).to.be.false;

       
    });

    
    
    
});
