import { SET } from './types';

export const setStatus = (
    landingScene,
    roleDeclaredByUser,
    onboardingFinished,
    showIntroToHeartfulness,
) => {
    return {
        type: SET,
        payload: {
            landingScene,
            roleDeclaredByUser,
            onboardingFinished,
            showIntroToHeartfulness,
        },
    };
};
