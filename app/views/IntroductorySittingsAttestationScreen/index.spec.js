import React from 'react';
import { IntroductorySittingsAttestationScreenContainer } from './index';
import IntroductorySittingsAttestationScreen from './IntroductorySittingsAttestationScreen';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Actions } from 'react-native-router-flux';
import {
    COMPLETED_INTRO_SESSIONS_AT_EVENT,
    COMPLETED_INTRO_SESSIONS_WITH_TRAINER,
} from './IntroductorySittingsAttestationOptions';
import * as ProfileService from '../../services/grpc/ProfileService';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('IntroductorySittingsAttestationScreenContainer', () => {
    const Component = props => {
        return render(<IntroductorySittingsAttestationScreenContainer
            t={() => {}}
            {...props}
        />);
    };
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    const actionsPushMock = jest
        .spyOn(Actions, 'push')
        .mockImplementation(() => {});
    const actionsJumpMock = jest
        .spyOn(Actions, 'jump')
        .mockImplementation(() => {});
    const selfAttestForIntroSittingMock = jest
        .spyOn(ProfileService, 'selfAttestForIntroSitting')
        .mockImplementation(() => {});
    afterEach(() => {
        logEventMock.mockClear();
        actionsJumpMock.mockClear();
        actionsPushMock.mockClear();
        selfAttestForIntroSittingMock.mockClear();
    });

    it('Should have Introductory Sittings Attestation screen in container ', () => {
        const { container } = Component();
        expect(container.findByType(IntroductorySittingsAttestationScreen)).toBeDefined();
    });
    it('Should call go back on back button press event', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ goBack: onBackPressMock });
        fireEvent(container.findByType(IntroductorySittingsAttestationScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should able to navigate to benefits screen, when user press Submit button from How did you complete screen', () => {
        const setTakenIntroductorySittingsMock = jest.fn();
        const { container } = Component({
            introSessionCompletionStatus: COMPLETED_INTRO_SESSIONS_AT_EVENT,
            setTakenIntroductorySittings: setTakenIntroductorySittingsMock,
        });
        fireEvent(container.findByType(IntroductorySittingsAttestationScreen), 'SubmitPress');
        expect(logEventMock).toBeCalledWith(
            'taken3Sittings_submit',
            Scenes.introductorySittingsAttestationScreen,
        );
        expect(selfAttestForIntroSittingMock).toHaveBeenCalledWith({
            introSessionCompletionStatus: COMPLETED_INTRO_SESSIONS_AT_EVENT,
        });
        expect(setTakenIntroductorySittingsMock).toBeCalledWith(true);
        expect(actionsPushMock).toBeCalledWith(
            Scenes.benefitsOfMeditatingWithTrainer,
        );
    });
    it('Should able to change the intro session completion state, when user press radio button in How did you complete screen', () => {
        const { container } = Component({});
        fireEvent(container.findByType(IntroductorySittingsAttestationScreen), 'AttestationRadioPress', {
            id: COMPLETED_INTRO_SESSIONS_WITH_TRAINER,
        });
        expect(logEventMock).toBeCalledWith(
            'taken3Sittings_fromTrainer',
            Scenes.introductorySittingsAttestationScreen,
        );
        expect(findByProps(container, 'introSessionCompletionStatus', COMPLETED_INTRO_SESSIONS_WITH_TRAINER)).toBeDefined();
    });
});