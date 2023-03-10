import reducer from './reducers';
import { Scenes } from '../../shared/Constants';
import { SET } from './types';
import { NEW_TO_HEARTFULNESS } from '../../views/FirstTimeLandingScreen/Options';

describe('onboardingStatusReducers', () => {
    it('Should set initial state by default', () => {
        expect(reducer(undefined, {})).toEqual({
            landingScene: Scenes.appEntryPoint,
            roleDeclaredByUser: null,
            onboardingFinished: false,
            showIntroToHeartfulness: false,
        });
    });

    it('Should set roleDeclaredByUser to null if value is not passed in payload', () => {
        expect(
            reducer(
                {
                    landingScene: Scenes.appEntryPoint,
                    roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                    onboardingFinished: false,
                },
                {
                    type: SET,
                    payload: {
                        landingScene: Scenes.masterClassesScreen,
                        roleDeclaredByUser: undefined,
                        onboardingFinished: true,
                    },
                },
            ),
        ).toEqual({
            landingScene: Scenes.masterClassesScreen,
            roleDeclaredByUser: null,
            onboardingFinished: true,
        });
    });

    it('Should set role passed in payload', () => {
        expect(
            reducer(undefined, {
                type: SET,
                payload: {
                    landingScene: Scenes.masterClassesScreen,
                    roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                    onboardingFinished: true,
                },
            }),
        ).toEqual({
            landingScene: Scenes.masterClassesScreen,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            onboardingFinished: true,
        });
    });

    it('Should not handle other actions', () => {
        expect(
            reducer(
                {
                    landingScene: Scenes.appEntryPoint,
                    roleDeclaredByUser: null,
                    onboardingFinished: false,
                },
                {
                    type: 'RandomeAction',
                    payload: Scenes.masterClassesScreen,
                },
            ),
        ).toEqual({
            landingScene: Scenes.appEntryPoint,
            roleDeclaredByUser: null,
            onboardingFinished: false,
        });
    });
});
