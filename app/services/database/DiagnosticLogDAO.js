import { database } from './Database';
import moment from 'moment';
import { isNil } from 'lodash';

export const log = async (time = moment(), entity, event, parametersJson) => {
    const db = await database.getDatabase();

    // console.log(
    //     `${time} - ${entity} - ${event} - ${JSON.stringify(
    //         parametersJson,
    //     )}`,
    // );

    await db.executeSql(
        `INSERT INTO DIAGNOSTIC_LOG ( 
            log_time, 
            entity,
            event,
            parameters_json 
        ) VALUES (?, ?, ?, ?);`,
        [time.unix(), entity, event, JSON.stringify(parametersJson)],
    );
};

export const countNoOfLogs = async () => {
    const db = await database.getDatabase();
    const results = await db.executeSql(
        'SELECT COUNT(*) as c FROM DIAGNOSTIC_LOG;',
    );

    const row = results[0].rows.item(0);
    const { c } = row;
    return c;
};

const _executeLast7DayQuery = async sql => {
    const db = await database.getDatabase();

    const timBefore7Days = moment()
        .subtract(7, 'days')
        .unix();

    return db.executeSql(sql, [timBefore7Days]);
};

export const deleteLogsOlderThan7Days = async () => {
    return _executeLast7DayQuery(`
    DELETE FROM 
        DIAGNOSTIC_LOG 
    WHERE
        log_time < ?;`);
};

export const deleteAllLogs = async () => {
    const db = await database.getDatabase();
    return db.executeSql(`
    DELETE FROM 
        DIAGNOSTIC_LOG;`);
};

export const getLogs = async (offset, limit) => {
    const limitConjunction = !isNil(limit) ? `LIMIT ${limit}` : '';
    const offsetConjunction = !isNil(offset) ? `OFFSET ${offset}` : '';
    const db = await database.getDatabase();
    const results = await db.executeSql(
        `
        SELECT * 
        FROM  
            DIAGNOSTIC_LOG
        ORDER BY 
            log_time ASC
            ${limitConjunction}
            ${offsetConjunction}`,
    );

    return results[0];
};
