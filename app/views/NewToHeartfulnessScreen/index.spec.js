import React from 'react';
import { NewToHeartfulnessScreenContainer, mapStateToProps } from './index';
import NewToHeartfulnessScreen from './NewToHeartfulnessScreen';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import { NEW_TO_HEARTFULNESS } from '../FirstTimeLandingScreen/Options';
import * as AsyncUtils from '../../utils/AsyncUtils';
import { render, fireEvent } from '../../utils/TestUtils';

const CarouselCardDataMock = jest.requireMock('./CarouselCardData.js');
jest.mock('./CarouselCardData', () => ({
    CarouselCardData: [
        {
            title: 'test',
            heading: 'test',
            headingSuffixHighlightedText: 'test',
            description: 'test',
            image: 'carousel_card_1',
        },
    ]
}));

describe('NewToHeartfulnessScreenContainer', () => {
    const saveOnboardingStatusMock = jest.fn();
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    const waitMock = jest
        .spyOn(AsyncUtils, 'wait')
        .mockImplementation(() => Promise.resolve());
    const Component = (props) => render(<NewToHeartfulnessScreenContainer {...props} />);

    afterEach(() => {
        logEventMock.mockClear();
        waitMock.mockClear();
        saveOnboardingStatusMock.mockClear();
    });

    it('Should NewToHeartfulnessScreen exist in container ', () => {
        const { container } =
            Component({},
            );
        expect(container.findAllByType(NewToHeartfulnessScreen)).toHaveLength(1);
    });


    it('Should fire onPressCarouselCard event, when CarouselCard is pressed', async () => {
        CarouselCardDataMock.CarouselCardData = [
            title = 'test',
            heading = 'test',
        ];
        const { container } = Component({});
        const consthelpDeskScreen = container.findByType(NewToHeartfulnessScreen)
        fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await expect(waitMock).toHaveBeenCalledWith(250);
        fireEvent(container.findByType(NewToHeartfulnessScreen), 'onPressCarouselCard');
        const index = container.findByType(NewToHeartfulnessScreen)._fiber._debugOwner.alternate.memoizedState.selectedIndex
        const enableProceedButton = container.findByType(NewToHeartfulnessScreen)._fiber._debugOwner.alternate.memoizedState.enableProceedButton
        expect(index).toEqual(1)
        expect(enableProceedButton).toEqual(true)
        await expect(logEventMock).toBeCalledWith(
            'about_hfn_carosel_2',
            Scenes.newToHeartfulness,
        );
    });

    it('Should fire onPressCarouselCard event, when CarouselCard is pressed and increase selected index', async () => {
        CarouselCardDataMock.CarouselCardData = [
            title = 'test',
            heading = 'test',
            heading = 'test',
        ];
        const { container } = Component({});
        const consthelpDeskScreen = container.findByType(NewToHeartfulnessScreen)
        await fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await fireEvent(consthelpDeskScreen, 'PressCarouselCard');
        await expect(waitMock).toHaveBeenCalledWith(250);
        fireEvent(container.findByType(NewToHeartfulnessScreen), 'onPressCarouselCard');
        const index = container.findByType(NewToHeartfulnessScreen)._fiber._debugOwner.alternate.memoizedState.selectedIndex
        const enableProceedButton = container.findByType(NewToHeartfulnessScreen)._fiber._debugOwner.alternate.memoizedState.enableProceedButton
        expect(index).toEqual(2)
        expect(enableProceedButton).toEqual(true)
        await expect(logEventMock).toBeCalledWith(
            'about_hfn_carosel_3',
            Scenes.newToHeartfulness,
        );
    });
    it('Should handle onPressProceedButton event, when ProceedButton is pressed', async () => {
        const { container } =
            Component({
                saveOnboardingStatus: saveOnboardingStatusMock,
                roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            },
            );
        fireEvent(container.findByType(NewToHeartfulnessScreen), 'PressProceedButton');
        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.whatAreYouLookingForScreen,
            NEW_TO_HEARTFULNESS,
            true,
        );
        expect(logEventMock).toBeCalledWith(
            'about_hfn_proceed',
            Scenes.newToHeartfulness,
        );
    });
    it('Should handle onSkipPress event, when Skip button pressed', async () => {
        const { container } =
            Component({
                saveOnboardingStatus: saveOnboardingStatusMock,
                roleDeclaredByUser: NEW_TO_HEARTFULNESS,
            },
            );
        fireEvent(container.findByType(NewToHeartfulnessScreen), 'onSkipPress');

        expect(saveOnboardingStatusMock).toBeCalledWith(
            Scenes.home,
            NEW_TO_HEARTFULNESS,
            true,
        );
        expect(logEventMock).toBeCalledWith(
            'about_hfn_skip',
            Scenes.newToHeartfulness,
        );
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
