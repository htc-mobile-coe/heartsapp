import React from 'react';
import {
    ExperienceInMeditationScreenContainer,
    mapStateToProps,
} from './index';
import ExperienceInMeditationScreen from './ExperienceInMeditationScreen';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import {
    NEVER_MEDITATED,
    FEW_TIMES_MEDITATED,
    REGULARLY_MEDITATED,
} from './Options';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { NEW_TO_HEARTFULNESS } from '../FirstTimeLandingScreen/Options';
import { render, fireEvent } from '../../utils/TestUtils';

describe('ExperienceInMeditationScreenContainer', () => {
    const Component = (props) => render(<ExperienceInMeditationScreenContainer {...props} />);

    const meditationExperienceDetailScreenMock = jest.fn();
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });

    afterEach(() => {
        meditationExperienceDetailScreenMock.mockClear();
        logEventMock.mockClear();
    });

    it('Should Experience In Meditation Screen in container ', () => {
        const { container } = Component();
        expect(container.findAllByType(ExperienceInMeditationScreen)).toHaveLength(1);

    });

    it('Should handle onSkipPress event, when skip button is pressed ', () => {
        const saveOnboardingStatusMock = jest.fn();
        const { container } = Component({
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            saveOnboardingStatus: saveOnboardingStatusMock,
        });

        fireEvent(container.findByType(ExperienceInMeditationScreen), 'SkipPress');
        expect(logEventMock).toBeCalledWith(
            'meditation_exp_skip',
            Scenes.experienceInMeditationScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });
    it('Should handle onNeverMeditatedPress event, when never meditated button is pressed ', () => {
        Actions.meditationExperienceDetailScreen = meditationExperienceDetailScreenMock;
        const { container } = Component();
        fireEvent(container.findByType(ExperienceInMeditationScreen), 'NeverMeditatedPress');
        expect(meditationExperienceDetailScreenMock).toBeCalledWith({
            selectedOption: NEVER_MEDITATED,
        });
        expect(logEventMock).toBeCalledWith(
            'meditation_exp_never',
            Scenes.experienceInMeditationScreen,
        );
    });
    it('Should handle onFewTimesMeditatedPress event, when few times meditated button is pressed ', () => {
        Actions.meditationExperienceDetailScreen = meditationExperienceDetailScreenMock;
        const { container } = Component();
        fireEvent(container.findByType(ExperienceInMeditationScreen), 'FewTimesMeditatedPress');
        expect(meditationExperienceDetailScreenMock).toBeCalledWith({
            selectedOption: FEW_TIMES_MEDITATED,
        });
        expect(logEventMock).toBeCalledWith(
            'meditation_exp_fewTimes',
            Scenes.experienceInMeditationScreen,
        );
    });
    it('Should handle onRegularlyMeditatedPress event, when regularly meditated button is pressed ', () => {
        Actions.meditationExperienceDetailScreen = meditationExperienceDetailScreenMock;
        const { container } = Component();
        fireEvent(container.findByType(ExperienceInMeditationScreen), 'RegularlyMeditatedPress');
        expect(meditationExperienceDetailScreenMock).toBeCalledWith({
            selectedOption: REGULARLY_MEDITATED,
        });
        expect(logEventMock).toBeCalledWith(
            'meditation_exp_regular',
            Scenes.experienceInMeditationScreen,
        );
    });
    it('Should populate redux value to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    landingScene: Scenes.experienceInMeditationScreen,
                    roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                    onboardingFinished: false,
                    showIntroToHeartfulness: false,
                },
            }),
        ).toEqual({
            landingScene: Scenes.experienceInMeditationScreen,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            onboardingFinished: false,
            showIntroToHeartfulness: false,
        });
    });
});
