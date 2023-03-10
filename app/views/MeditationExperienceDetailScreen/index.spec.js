import React from 'react';
import {
    MeditationExperienceDetailScreenContainer,
    mapStateToProps,
} from './index';
import MeditationExperienceDetailScreen from './MeditationExperienceDetailScreen';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import {
    NEVER_MEDITATED,
    REGULARLY_MEDITATED,
} from '../ExperienceInMeditationScreen/Options';
import { NEW_TO_HEARTFULNESS } from '../FirstTimeLandingScreen/Options';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('MeditationExperienceDetailScreenContainer', () => {
    const Component = props => {
        return render(<MeditationExperienceDetailScreenContainer
            t={() => {}}
            {...props}
        />);
    };
    const saveOnboardingStatusMock = jest.fn();
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    afterEach(() => {
        logEventMock.mockClear();
        saveOnboardingStatusMock.mockClear();
    });

    it('Should Meditation Experience Detail Screen component exist in container ', () => {
        const { container } = Component();
        expect(container.findByType(MeditationExperienceDetailScreen)).toBeDefined();
    });

    it('Should able to navigate to home screen, when user tap Skip button from Hello beginner screen', () => {
        const { container } = Component({
            selectedOption: NEVER_MEDITATED,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            saveOnboardingStatus: saveOnboardingStatusMock,
        });
        fireEvent(container.findByType(MeditationExperienceDetailScreen), 'SkipPress');
        expect(logEventMock).toBeCalledWith(
            'hello_beginner_page1_skip',
            Scenes.meditationExperienceDetailScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });

    it('Should able to navigate to home screen, when user tap Skip button from experienced meditator screen', () => {
        const { container } = Component({
            selectedOption: REGULARLY_MEDITATED,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            saveOnboardingStatus: saveOnboardingStatusMock,
        });
        fireEvent(container.findByType(MeditationExperienceDetailScreen), 'SkipPress');
        expect(logEventMock).toBeCalledWith(
            'hello_beginner_page2_skip',
            Scenes.meditationExperienceDetailScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });

    it("Should able to navigate to home screen, when user tap Let's Start button from Hello beginner screen", () => {
        const { container } = Component({
            selectedOption: NEVER_MEDITATED,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            saveOnboardingStatus: saveOnboardingStatusMock,
        });
        fireEvent(container.findByType(MeditationExperienceDetailScreen), 'LetsStartPress');
        expect(logEventMock).toBeCalledWith(
            'hello_beginner_page1_letsStart',
            Scenes.meditationExperienceDetailScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });
    it("Should able to navigate to home screen, when user tap Let's Start button from experienced meditator screen", () => {
        const { container } = Component({
            selectedOption: REGULARLY_MEDITATED,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            saveOnboardingStatus: saveOnboardingStatusMock,
        });
        fireEvent(container.findByType(MeditationExperienceDetailScreen), 'LetsStartPress');
        expect(logEventMock).toBeCalledWith(
            'hello_beginner_page2_letsStart',
            Scenes.meditationExperienceDetailScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });

    it('Should populate redux value to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    landingScene: Scenes.meditationExperienceDetailScreen,
                    roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                    onboardingFinished: false,
                    showIntroToHeartfulness: false,
                },
            }),
        ).toEqual({
            landingScene: Scenes.meditationExperienceDetailScreen,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            onboardingFinished: false,
            showIntroToHeartfulness: false,
        });
    });
});