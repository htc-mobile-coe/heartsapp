import StorageService from '../../services/native/AppStorageService';
import { Scenes } from '../../shared/Constants';
import { setStatus } from './actions';
import { Actions } from 'react-native-router-flux';

const DEFAULT_STATUS = {
    landingScene: Scenes.onboarding,
    roleDeclaredByUser: null,
    onboardingFinished: false,
    showIntroToHeartfulness: true,
};

export const loadFromStorage = () => {
    return async dispatch => {
        try {
            const statusInStorage = await StorageService.getOnboardingStatus();

            if (statusInStorage) {
                _dispatch(dispatch, statusInStorage);
            } else {
                _dispatch(dispatch, DEFAULT_STATUS);
            }
        } catch (e) {
            _dispatch(dispatch, DEFAULT_STATUS);
        }
    };
};

export const saveOnboardingStatus = (
    landingScene,
    roleDeclaredByUser = null,
    onboardingFinished = false,
    showIntroToHeartfulness = false,
) => dispatch => {
    const status = {
        landingScene,
        roleDeclaredByUser,
        onboardingFinished,
        showIntroToHeartfulness,
    };
    _dispatch(dispatch, status);
    _navigateToLandingScene(status);
    StorageService.setOnboardingStatus(status).catch(() => {});
};

const _dispatch = (
    dispatch,
    {
        landingScene,
        roleDeclaredByUser,
        onboardingFinished,
        showIntroToHeartfulness,
    },
) => {
    dispatch(
        setStatus(
            landingScene,
            roleDeclaredByUser,
            onboardingFinished,
            showIntroToHeartfulness,
        ),
    );
};

const _navigateToLandingScene = ({ landingScene }) => {
    Actions.replace(landingScene);
};
