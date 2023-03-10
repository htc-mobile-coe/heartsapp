import React from 'react';
import { WhatAreYouLookingForScreenContainer, mapStateToProps } from './index';
import WhatAreYouLookingForScreen from './WhatAreYouLookingForScreen';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { NEW_TO_HEARTFULNESS } from '../FirstTimeLandingScreen/Options';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('WhatAreYouLookingForScreenContainer', () => {
    const Component = props => {
        return render(<WhatAreYouLookingForScreenContainer {...props} />);
    };

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    afterEach(() => {
        logEventMock.mockClear();
    });
    it('Should have WhatAreYouLookingForScreen in container ', () => {
        const { container } = Component();
        expect(container.findByType(WhatAreYouLookingForScreen)).toBeDefined();
    });
    it('Should handle onTileButtonPress button press event, when button is selected', () => {
        const { container } = Component({});
        fireEvent(container.findByType(WhatAreYouLookingForScreen), 'TileButtonPress', 1, true);
        expect(logEventMock).toBeCalledWith(
            'lookingFor_meditationTechnik',
            Scenes.whatAreYouLookingForScreen,
        );
    });

    it('Should able to call onSkipButtonPress', () => {
        const saveOnboardingStatusMock = jest.fn();
        const { container } = Component({
            saveOnboardingStatus: saveOnboardingStatusMock,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
        });
        fireEvent(container.findByType(WhatAreYouLookingForScreen), 'SkipButtonPress');
        expect(logEventMock).toBeCalledWith(
            'lookingFor_skip',
            Scenes.whatAreYouLookingForScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });
    it('Should able to save Onboarding status, when continue button pressed', () => {
        const saveOnboardingStatusMock = jest.fn();
        const { container } = Component({
            saveOnboardingStatus: saveOnboardingStatusMock,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
        });
        fireEvent(container.findByType(WhatAreYouLookingForScreen), 'ContinueButtonPress');
        expect(logEventMock).toBeCalledWith(
            'lookingFor_continue',
            Scenes.whatAreYouLookingForScreen,
        );
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.experienceInMeditationScreen,
            NEW_TO_HEARTFULNESS,
            true,
        );
    });
    it('Should populate redux value to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    landingScene: Scenes.whatAreYouLookingForScreen,
                    roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                    onboardingFinished: false,
                    showIntroToHeartfulness: false,
                },
            }),
        ).toEqual({
            landingScene: Scenes.whatAreYouLookingForScreen,
            roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            onboardingFinished: false,
            showIntroToHeartfulness: false,
        });
    });
});