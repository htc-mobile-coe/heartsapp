import AsyncStorage from '@react-native-async-storage/async-storage';
import { isNil, isUndefined } from 'lodash';

export default class StorageItem {
    constructor(key) {
        this.key = key;
    }

    setValue = value => AsyncStorage.setItem(this.key, JSON.stringify(value));

    getValue = async () => {
        const value = await AsyncStorage.getItem(this.key);
        const valueIsPresent = !isUndefined(value) && !isNil(value);

        if (valueIsPresent) {
            return JSON.parse(value);
        }

        return undefined;
    };

    clear = () => AsyncStorage.removeItem(this.key);
}
