import {
    log as logToDatabase,
    deleteLogsOlderThan7Days as deleteLogsOlderThan7DaysFromDB,
    countNoOfLogs,
    getLogs as getLogsFromDB,
    deleteAllLogs as deleteAllLogsFromDB,
} from './database/DiagnosticLogDAO';
import { chain, isEmpty, toString } from 'lodash';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

export const log = (entity, event, parametersJson, time = moment()) => {
    if (!isEmpty(parametersJson)) {
        logToDatabase(
            time,
            entity,
            event,
            flatten({
                deviceTime: time.format('MMMM Do YYYY, h:mm:ss a'),
                appVersion: DeviceInfo.getVersion(),
                deviceMake: DeviceInfo.getBrand(),
                deviceModel: DeviceInfo.getModel(),
                platform: DeviceInfo.getSystemName(),
                osVersion: DeviceInfo.getSystemVersion(),
                ...parametersJson,
            }),
        );
    } else {
        logToDatabase(time, entity, event, {
            deviceTime: time.format('MMMM Do YYYY, h:mm:ss a'),
        });
    }
};

const flatten = (obj, path = '') => {
    if (!(obj instanceof Object))
        return {
            [path.replace(/\.$/g, '')]: toString(obj),
        };

    if (obj instanceof moment) {
        return { [path.replace(/\.$/g, '')]: toString(obj.unix()) };
    }

    return chain(obj)
        .keys()
        .reduce((output, key) => {
            return obj instanceof Array
                ? { ...output, ...flatten(obj[key], `${path}[${key}].`) }
                : { ...output, ...flatten(obj[key], `${path}${key}.`) };
        }, {})
        .value();
};

export const deleteLogsOlderThan7Days = async () => {
    return deleteLogsOlderThan7DaysFromDB();
};

export const deleteAllLogs = async () => {
    return deleteAllLogsFromDB();
};

export const getTotalNoOfLogs = async () => {
    return countNoOfLogs();
};

export const getLogs = async (offset, limit) => {
    const result = await getLogsFromDB(offset, limit);
    const noOfRecords = result.rows.length;
    const logLines = [];

    for (let i = 0; i < noOfRecords; i++) {
        const logLine = result.rows.item(i);

        const { entity, event, log_time, parameters_json } = logLine;

        logLines.push({
            time: {
                seconds: log_time,
            },
            message: `${entity}-${event}`,
            payload: JSON.parse(parameters_json),
        });
    }

    return logLines;
};
