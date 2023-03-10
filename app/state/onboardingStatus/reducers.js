import { Scenes } from '../../shared/Constants';
import { SET } from './types';
import { isUndefined } from 'lodash';

const initial = {
    landingScene: Scenes.appEntryPoint,
    roleDeclaredByUser: null,
    onboardingFinished: false,
    showIntroToHeartfulness: false,
};

const getRoleDeclaredByUser = payload => {
    if (isUndefined(payload.roleDeclaredByUser)) {
        return null;
    }

    return payload.roleDeclaredByUser;
};

export default (previousState = initial, action) => {
    if (action.type === SET) {
        return {
            landingScene: action.payload.landingScene,
            roleDeclaredByUser: getRoleDeclaredByUser(action.payload),
            onboardingFinished: action.payload.onboardingFinished,
            showIntroToHeartfulness: action.payload.showIntroToHeartfulness,
        };
    }

    return previousState;
};
