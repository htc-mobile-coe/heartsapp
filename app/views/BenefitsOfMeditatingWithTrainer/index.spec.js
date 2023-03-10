import React from 'react';
import {
    BenefitsOfMeditatingWithTrainerScreenContainer,
    mapStateToProps,
} from './index';
import BenefitsOfMeditatingWithTrainerScreen from './BenefitsOfMeditatingWithTrainerScreen';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import * as AsyncUtils from '../../utils/AsyncUtils';
import { Actions } from 'react-native-router-flux';
import { render, fireEvent, findByProps, runAllPromises } from 'app/utils/TestUtils';

describe('BenefitsOfMeditatingWithTrainerScreenContainer', () => {
    const saveOnboardingStatusMock = jest.fn();
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    const waitMock = jest
        .spyOn(AsyncUtils, 'wait')
        .mockImplementation(() => Promise.resolve());

    const Component = props => {
        return render(<BenefitsOfMeditatingWithTrainerScreenContainer {...props} />);
    };

    afterEach(() => {
        logEventMock.mockClear();
        waitMock.mockClear();
        saveOnboardingStatusMock.mockClear();
    });

    it('Should BenefitsOfMeditatingWithTrainerScreen exist in container ', () => {
        const { container } = Component();
        expect(
            container.findByType(BenefitsOfMeditatingWithTrainerScreen),
        ).toBeDefined();
    });

    it('Should able to call onPressCarouselCard and zero to 1', async () => {
        const { container } = Component({});
        fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await runAllPromises();
        expect(findByProps(container, 'selectedIndex', 1)).toBeDefined();
        expect(findByProps(container, 'enableContinueButton', false)).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'AboutHFN_Carosel_2',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
    });
    it('Should able to call onPressCarouselCard and increase selected index', async () => {
        const { container } = Component({});
        await fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await runAllPromises();
        expect(findByProps(container, 'selectedIndex', 2)).toBeDefined();
        expect(findByProps(container, 'enableContinueButton', true)).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'AboutHFN_Carosel_3',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
    });

    it('Should able to call onPressCarouselCard start from zero and when selected index is two', async () => {
        const { container } = Component({});
        await fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressCarouselCard');
        await runAllPromises();
        expect(findByProps(container, 'selectedIndex', 0)).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'AboutHFN_Carosel_1',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
    });

    it('Should able to handle PressContinueButton event, when continue button pressed', () => {
        const { container } = Component({});
        const actionsMock = jest.spyOn(Actions, 'push');
        fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'PressContinueButton');
        expect(logEventMock).toBeCalledWith(
            'BenefitsOfMeditatingWithTrainer_Continue',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
        expect(actionsMock).toHaveBeenCalledWith(
            Scenes.additionalAbhyasisMeditatingInputScreen,
        );
    });
    it('Should able to handle SkipPress event, when skip button pressed', () => {
        const { container } = Component({});
        const actionsMock = jest.spyOn(Actions, 'push');
        fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'SkipPress');
        expect(logEventMock).toBeCalledWith(
            'BenefitsOfMeditatingWithTrainer_Skip',
            Scenes.benefitsOfMeditatingWithTrainer,
        );

        expect(actionsMock).toHaveBeenCalledWith(
            Scenes.additionalAbhyasisMeditatingInputScreen,
        );
    });

    it('Should able to handle BackPress event, when back button pressed', () => {
        const goBackMock = jest.fn();
        const { container } = Component({
            goBack: goBackMock,
        });
        fireEvent(container.findByType(BenefitsOfMeditatingWithTrainerScreen), 'BackPress');
        expect(goBackMock).toBeCalled();
    });

    it('Should populate redux value to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    landingScene: Scenes.appEntryPoint,
                    roleDeclaredByUser: null,
                    onboardingFinished: false,
                    showIntroToHeartfulness: false,
                },
            }),
        ).toEqual({
            landingScene: Scenes.appEntryPoint,
            roleDeclaredByUser: null,
            onboardingFinished: false,
            showIntroToHeartfulness: false,
        });
    });
});
