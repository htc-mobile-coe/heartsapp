import { isEmpty } from 'lodash';
import SQLite from 'react-native-sqlite-storage';
import { DatabaseInitialization } from './DatabaseInitialization';

export const DATABASE_CONSTANTS = {
    FILE_NAME: 'AppDatabase.db',
    BACKUP_FILE_NAME: 'AppDatabase_Backup.db',
};

class Database {
    getDatabase = async () => {
        if (!isEmpty(this.databaseInstance)) {
            return this.databaseInstance;
        }
        // otherwise: open the database first
        return this.open();
    };

    open = async () => {
        // SQLite.DEBUG(true);
        SQLite.enablePromise(true);

        if (this.databaseInstance) {
            return this.databaseInstance;
        }

        const db = await SQLite.openDatabase({
            name: DATABASE_CONSTANTS.FILE_NAME,
            location: 'default',
        });

        const databaseInitialization = new DatabaseInitialization();
        await databaseInitialization.updateDatabaseTables(db);

        this.databaseInstance = db;
        return db;
    };

    close = async () => {
        if (isEmpty(this.databaseInstance)) {
            return;
        }

        await this.databaseInstance.close();
        this.databaseInstance = undefined;
    };
}

export const database = new Database();
