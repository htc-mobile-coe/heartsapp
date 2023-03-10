import { Toast } from 'native-base';
import { recordError } from '../services/firebase/CrashlyticsService';
import { get } from 'lodash';

export const onError = (e, key = 'Generic error') => {
    // console.log(e.stack);
    // Alert.alert(key, e.message);
    recordError(`${key} - ${get(e, 'message')}`);

    Toast.show({
        description: `Something went wrong - ${key} - ${get(e, 'message')}`,
        duration: 6000,
    });
};
