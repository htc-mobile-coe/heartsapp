import React from 'react';
import { MasterClassesScreenContainer, mapStateToProps } from './index';
import MasterClassesScreen from './MasterClassesScreen';
import { Actions } from 'react-native-router-flux';
import { MASTERCLASS_VIDEOS, Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Toast } from 'native-base';
import MasterClassFinishedDatesLoggingService from '../../services/MasterClassFinishedDatesLoggingService';
import VideoPlayer from '../shared/VideoPlayer';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import { wait } from '../../utils/AsyncUtils';
import { getMasterClassScreenConfig } from 'app/services/firebase/RemoteConfigService';

describe('MasterClassesScreenContainer', () => {
    const Component = props => {
        return render(<MasterClassesScreenContainer 
            {...props} 
            t={jest.fn()} 
            masterClassConfig={getMasterClassScreenConfig()}
        />);
    };

    const masterClassesFinishedDatesMock = {
        introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
        day1: '2021-07-14T05:55:47.881Z',
        day2: null,
        day3: null,
    };
    const videoUnlockedStateMock = {
        introductionAboutMasterClasses: true,
        day1: true,
        day2: true,
        day3: false,
    };
    const setVideoPauseMock = jest.fn();
    const onRequestedToGoBackMock = jest
        .spyOn(MasterClassProgressService, 'onRequestedToGoBack')
        .mockImplementation(() => {});
    const logVideoPlayPressMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayPress')
        .mockImplementation(() => {});
    const logVideoPlayEndMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayEnd')
        .mockImplementation(() => {});
    const logVideoBackPressMock = jest
        .spyOn(AnalyticsService, 'logVideoBackPress')
        .mockImplementation(() => {});

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    const actionsJumpMock = jest
        .spyOn(Actions, 'jump')
        .mockImplementation(() => {});

    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
    const masterClassFinishedDatesLoggingServiceMock = jest.spyOn(
        MasterClassFinishedDatesLoggingService,
        'log',
    );

    afterEach(() => {
        setVideoPauseMock.mockClear();
        onRequestedToGoBackMock.mockClear();
        logEventMock.mockClear();
        actionsJumpMock.mockClear();
        toastMock.mockClear();
        masterClassFinishedDatesLoggingServiceMock.mockClear();
    });

    it('Should Master Classes Screen exist in container ', () => {
        const { container } = Component();
        expect(container.findByType(MasterClassesScreen)).toBeDefined();
    });

    it('Should call onRequestedToGoBack when back button press event', () => {
        const { container } = Component({ showHomeButton: true });
        fireEvent(container.findByType(MasterClassesScreen), 'BackPress');
        expect(onRequestedToGoBackMock).toHaveBeenCalled();
    });
    
    it('Should able to handle Play press event, when user clicks on play button from Master Classes screen and selected content is intro to masterclass', () => {
        const OnVideoWatchedMock = jest
            .spyOn(MasterClassProgressService, 'onVideoWatched')
            .mockImplementation(() => {});

        const { container } = Component({
            selectedContent: 'introductionAboutMasterClasses',
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'introductionAboutMasterClasses',
            firebaseEvent: 'introductionAboutMasterClasses',
        });
        expect(setVideoPauseMock).toBeCalledWith(false);

        expect(logEventMock).toBeCalledWith(
            'masterclass_introductionAboutMasterClasses_videoViewed',
            Scenes.masterClassesScreen,
        );
        expect(masterClassFinishedDatesLoggingServiceMock).toHaveBeenCalledWith(
            'introductionAboutMasterClasses',
            true,
        );
        expect(OnVideoWatchedMock).toHaveBeenCalledWith(
            'introductionAboutMasterClasses',
        );
    });

    it('Should able to handle Play press event, when user clicks on play button from Master Classes screen and selected content is day1', () => {
        const { container } = Component({
            selectedContent: 'day1',
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'day1',
            firebaseEvent: 'day1',
        });
        expect(setVideoPauseMock).toBeCalledWith(false);

        expect(logEventMock).toBeCalledWith(
            'masterclass_day1_videoViewed',
            Scenes.masterClassesScreen,
        );
        expect(masterClassFinishedDatesLoggingServiceMock).toHaveBeenCalledWith(
            'day1',
            true,
        );
    });

    it('Should able to handle Play press event, when user clicks on play button from Master Classes screen and selected content is day2', () => {
        const { container } = Component({
            selectedContent: 'day2',
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'day2',
            firebaseEvent: 'day2',
        });
        expect(setVideoPauseMock).toBeCalledWith(false);

        expect(logEventMock).toBeCalledWith(
            'masterclass_day2_videoViewed',
            Scenes.masterClassesScreen,
        );
        expect(masterClassFinishedDatesLoggingServiceMock).toHaveBeenCalledWith(
            'day2',
            true,
        );
    });

    it('Should able to handle Play press event, when user clicks on play button from Master Classes screen and selected content is day3', () => {
        const { container } = Component({
            selectedContent: 'day3',
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'day3',
            firebaseEvent: 'day3',
        });
        expect(setVideoPauseMock).toBeCalledWith(false);

        expect(logEventMock).toBeCalledWith(
            'masterclass_day3_videoViewed',
            Scenes.masterClassesScreen,
        );
        expect(masterClassFinishedDatesLoggingServiceMock).toHaveBeenCalledWith(
            'day3',
            true,
        );
    });

    it('Should not handle Play press event, when user clicks on play button from Master Classes screen and selected content is undefined', () => {
        const setMasterClassFinishedMock = jest.fn();
        const { container } = Component({
            selectedContent: undefined,
            setMasterClassFinished: setMasterClassFinishedMock,
            takenIntroSittings: true,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', { id: undefined });
        expect(logEventMock).toBeCalledWith(
            'masterclass_undefined_videoViewed',
            Scenes.masterClassesScreen,
        );
    });

    it('Should able to handle language change, when user clicks on language picker from Master Classes screen', () => {
        const { container } = Component({
            uiState: 'DAY_2_MASTER_CLASS_VIDEO_INFO',
            masterClassSelectedLanguage: 'da',
            masterClassesFinishedDates: masterClassesFinishedDatesMock,
            unlockedState: videoUnlockedStateMock,
            takenIntroSittings: false,
            masterClassContent: MASTERCLASS_VIDEOS.DAY2,
        });
        fireEvent(container.findByType(MasterClassesScreen),'SelectedLanguageChange', 'en' );
        expect(logEventMock).toBeCalledWith(
            'masterclass_day2_language_dropDown',
            Scenes.masterClassesScreen,
        );
        expect(findByProps(container.findByType(MasterClassesScreen),'SelectedLanguage', 'en')).toBeDefined();
    });

    it('Should able to show to learn more content, when user press Learn More button from Master Classes screen', () => {
        const { container } = Component({
            uiState: 'DAY_2_MASTER_CLASS_VIDEO_INFO',
        });
        fireEvent(container.findByType(MasterClassesScreen), 'LearnMorePress');
        expect(logEventMock).toBeCalledWith(
            'masterclass_day2_LearnMore',
            Scenes.masterClassesScreen,
        );
        expect(findByProps(container, 'showLearnMore', true)).toBeDefined();
    });
    it('Should able to handle to learn more back press event, when user press back in Learn More', () => {
        const { container } = Component({
            uiState: 'DAY_2_MASTER_CLASS_VIDEO_INFO',
        });
        fireEvent(container.findByType(MasterClassesScreen), 'LearnMorePress');
        fireEvent(container.findByType(MasterClassesScreen), 'LearnMoreBackPress');
        expect(findByProps(container, 'showLearnMore', false)).toBeDefined();
    });
    it('Should able to show to masterclass Info content, when user press Info button from Master Classes Summary screen', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MasterClassesScreen),'MasterClassInfoPress');
        expect(
            findByProps(container, 'showMasterClassInfo', true),
        ).toBeDefined();
    });
    it('Should able to handle to masterclass info back press event, when user press back in MasterClass Info', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MasterClassesScreen),'MasterClassInfoPress');
        fireEvent(container.findByType(MasterClassesScreen), 'MasterClassInfoBackPress');
        expect(
            findByProps(container, 'showMasterClassInfo', false),
        ).toBeDefined();
    });
    it('Should able to navigate to next screen, when user clicks on continue button from Master Classes screen and enableContinueButton is false', () => {
        const { container } = Component({
            enableContinueButton: false,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'ContinueButtonPress', {
            toastMessage: 'MockMessage',
            id: 'day1',
            firebaseEvent: 'day1',
        });
        expect(logEventMock).toBeCalledWith(
            'masterclass_day1_continue',
            Scenes.masterClassesScreen,
        );
        expect(toastMock).toHaveBeenCalled();
    });

    it('Should able to navigate to next screen, when user clicks on continue button from Master Classes screen and enableContinueButton is true', () => {
        const dataMock = { id: 'day1', firebaseEvent: 'day1' };
        const onRequestedContinueForMasterClassMock = jest
            .spyOn(
                MasterClassProgressService,
                'onRequestedContinueForMasterClass',
            )
            .mockImplementation(() => {});

        const { container } = Component({
            enableContinueButton: true,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'ContinueButtonPress', dataMock);
        expect(logEventMock).toBeCalledWith(
            'masterclass_day1_continue',
            Scenes.masterClassesScreen,
        );
        expect(onRequestedContinueForMasterClassMock).toHaveBeenCalled();
    });

    it('Should able to play video event when VideoPlayer start playing', () => {
        const { container } = Component({
            unlockedState: videoUnlockedStateMock,
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'introductionAboutMasterClasses',
            firebaseEvent: 'introductionAboutMasterClasses',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        expect(setVideoPauseMock).toBeCalledWith(false);
        expect(logVideoPlayPressMock).toBeCalledWith(
            'masterclass',
            'introductionAboutMasterClasses',
            Scenes.masterClassesScreen,
            'en',
        );
    });
    it('Should able to pause video event when fire on Pause event', () => {
        const { container } = Component({
            unlockedState: videoUnlockedStateMock,
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'introductionAboutMasterClasses',
        });
        fireEvent(container.findByType(VideoPlayer), 'Pause');
        expect(setVideoPauseMock).toBeCalledWith(true);
    });
    it('Should able to end video when VideoPlayer has finished playing', () => {
        const { container } = Component({
            unlockedState: videoUnlockedStateMock,
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'introductionAboutMasterClasses',
            firebaseEvent: 'introductionAboutMasterClasses',
        });
        fireEvent(container.findByType(VideoPlayer), 'End');
        expect(logVideoPlayEndMock).toBeCalledWith(
            'masterclass',
            'introductionAboutMasterClasses',
            Scenes.masterClassesScreen,
            'en',
        );
    });
    it('Should able to dismiss when VideoPlayer back button pressed', () => {
        const { container } = Component({
            unlockedState: videoUnlockedStateMock,
            takenIntroSittings: true,
            setVideoPause: setVideoPauseMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'PlayPress', {
            id: 'introductionAboutMasterClasses',
            firebaseEvent: 'introduction',
        });
        fireEvent(container.findByType(VideoPlayer), 'Back');
        expect(findByProps(container.findByType(MasterClassesScreen), 'playVideo', false)).toBeDefined();
        expect(findByProps(container.findByType(MasterClassesScreen), 'video', null)).toBeDefined();
        expect(logVideoBackPressMock).toBeCalledWith(
            'masterclass',
            'introduction',
            Scenes.masterClassesScreen,
            'en',
        );
    });

    it('Should call onHomeButtonPress when home button is pressed', () => {
        const onRequestedToGoToHomeScreenMock = jest
            .spyOn(MasterClassProgressService, 'onRequestedToGoToHomeScreen')
            .mockImplementation(() => {});

        const { container } = Component({});
        fireEvent(container.findByType(MasterClassesScreen), 'HomeButtonPress');
        expect(onRequestedToGoToHomeScreenMock).toBeCalled();
    });

    it('Should call MasterClassProgressService onRequestedContinueForMasterClassMock when introduction to HFN meditation next is pressed', () => {
        const onRequestedContinueForMasterClassMock = jest
            .spyOn(
                MasterClassProgressService,
                'onRequestedContinueForMasterClass',
            )
            .mockImplementation(() => {});

        const { container } = Component({});
        fireEvent(container.findByType(MasterClassesScreen), 'IntroductionToHFNMeditationNextPress');
        expect(onRequestedContinueForMasterClassMock).toBeCalled();
    });

    it('Should call MasterClassProgressService onRequestedContinueForMasterClassMock when video card is pressed in MasterClassesProgressSummary', () => {
        const onRequestedContinueForMasterClassMock = jest
            .spyOn(
                MasterClassProgressService,
                'onRequestedContinueForMasterClass',
            )
            .mockImplementation(() => {});

        const { container } = Component({});
        fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress');
        expect(onRequestedContinueForMasterClassMock).toBeCalled();
    });

    it('Should display toast message when video card is pressed in MasterClassesProgressSummary and video is in locked state', () => {
        const { container } = Component({
            takenIntroSittings: false,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
        'day2',
        'true',
        'Mock Message',
        );
        expect(toastMock).toHaveBeenCalled();
    });

    it('Should call setMasterClassHomeButtonEnabledMock when master class completion carousel card is pressed', async () => {
        const setMasterClassHomeButtonEnabledMock = jest.fn();

        const { container } = Component({
            uiState: 'DAY_3_CONGRATULATIONS',
            enableHomeButton: true,
            setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'CarouselCardPress');
        await wait(250);
        expect(findByProps(container, 'selectedMasterClassCompletionCardIndex', 1)).toBeDefined();
        expect(setMasterClassHomeButtonEnabledMock).toBeCalledWith(true);
    });

    it('Should call setMasterClassHomeButtonEnabledMock when master class completion carousel last card is pressed', async () => {
        const setMasterClassHomeButtonEnabledMock = jest.fn();

        const { container } = Component({
            uiState: 'DAY_3_CONGRATULATIONS',
            setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
        });
        fireEvent(container.findByType(MasterClassesScreen), 'CarouselCardPress');
        await wait(250);
        fireEvent(container.findByType(MasterClassesScreen), 'CarouselCardPress');
        await wait(250);
        fireEvent(container.findByType(MasterClassesScreen), 'CarouselCardPress');
        await wait(250);
        expect(findByProps(container, 'selectedMasterClassCompletionCardIndex', 0)).toBeDefined();
        expect(setMasterClassHomeButtonEnabledMock).toBeCalledWith(false);
    });

    describe('noOfCardsInCompletionScreen', () => {
        it('Should be equal to 2 when uiState is DAY_3_CONGRATULATIONS', async () => {
            const { container } = Component({
                uiState: 'DAY_3_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('noOfCardsInCompletionScreen', 2);
        });

        it('Should be equal to 0 when uiState is other than DAY_3_CONGRATULATIONS', async () => {
            const { container } = Component({
                uiState: 'DAY_1_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('noOfCardsInCompletionScreen', 0);
        });
    });

    describe('masterClassCompletionContent', () => {
        it('When uiState is DAY_1_CONGRATULATIONS', async () => {
            const { container } = Component({
                uiState: 'DAY_1_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassCompletionContent', {
                description1: undefined,
                description2: undefined,
                descriptionHighlightedText1: undefined,
                descriptionHighlightedText2: undefined,
                image: 'masterClass_day_1',
                subTitle: undefined,
                title: undefined,
                descriptionFullStop: '.',
            });
        });
        it('When uiState is DAY_2_WELCOME_BACK', async () => {
            const { container } = Component({
                uiState: 'DAY_2_WELCOME_BACK',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassCompletionContent', {
                description1: undefined,
                description2: undefined,
                description3: undefined,
                descriptionHighlightedText1: undefined,
                descriptionHighlightedText2: undefined,
                image: 'masterClass_day_2',
                subTitle: undefined,
                title: undefined,
            });
        });
        it('When uiState is DAY_2_CONGRATULATIONS', async () => {
            const { container } = Component({
                uiState: 'DAY_2_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassCompletionContent', {
                description1: undefined,
                description2: undefined,
                description3: undefined,
                descriptionHighlightedText1: undefined,
                descriptionHighlightedText2: undefined,
                image: 'masterClass_day_2',
                subTitle: undefined,
                title: undefined,
                descriptionFullStop: '.',
            });
        });
        it('When uiState is DAY_3_WELCOME_BACK', async () => {
            const { container } = Component({
                uiState: 'DAY_3_WELCOME_BACK',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassCompletionContent',{
                description1: undefined,
                description2: undefined,
                description3: undefined,
                descriptionHighlightedText1: undefined,
                descriptionHighlightedText2: undefined,
                image: 'masterClass_day_3',
                subTitle: undefined,
                title: undefined,
            });
        });
    });

    describe('masterClassContent', () => {
        it('When uiState is DAY_1_MASTER_CLASS_VIDEO_INFO', async () => {
            const { container } = Component({
                uiState: 'DAY_1_MASTER_CLASS_VIDEO_INFO',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassContent', 'day1');
        });
        it('When uiState is DAY_2_MASTER_CLASS_VIDEO_INFO', async () => {
            const { container } = Component({
                uiState: 'DAY_2_MASTER_CLASS_VIDEO_INFO',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassContent', 'day2');
        });
        it('When uiState is DAY_3_MASTER_CLASS_VIDEO_INFO', async () => {
            const { container } = Component({
                uiState: 'DAY_3_MASTER_CLASS_VIDEO_INFO',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassContent', 'day3');
        });
        it('When uiState is introductionAboutMasterClasses', async () => {
            const { container } = Component({});
            expect(container.findByType(MasterClassesScreen)).toHaveProp('masterClassContent', 'introductionAboutMasterClasses');
        });
    });

    describe('containerOptions', () => {
        it('When uiState is INTRODUCTION_TO_HFN_MEDITATION', async () => {
            const { container } = Component({
                uiState: 'INTRODUCTION_TO_HFN_MEDITATION',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('containerOptions', 'INTRODUCTION_TO_HFN_MEDITATION_CONTAINER');
        });
        it('When uiState is MASTER_CLASS_PROGRESS_SUMMARY', async () => {
            const { container } = Component({
                uiState: 'MASTER_CLASS_PROGRESS_SUMMARY',
                masterClassSelectedLanguage: 'en',
                masterClassesFinishedDates: masterClassesFinishedDatesMock,
                unlockedState: videoUnlockedStateMock,
                takenIntroSittings: false,
                masterClassContent: MASTERCLASS_VIDEOS.DAY2,
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('containerOptions', 'MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER');
        });
        it('When uiState is DAY_3_CONGRATULATIONS', async () => {
            const { container } = Component({
                uiState: 'DAY_3_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('containerOptions','MASTER_CLASS_COMPLETION_CONTAINER');
        });
        it('When uiState is DAY_1_CONGRATULATIONS or DAY_2_CONGRATULATIONS or DAY_2_WELCOME_BACK or DAY_3_WELCOME_BACK', async () => {
            const { container } = Component({
                uiState: 'DAY_1_CONGRATULATIONS',
            });
            expect(container.findByType(MasterClassesScreen)).toHaveProp('containerOptions','MASTER_CLASS_INFO_CONTAINER');
        });
        it('When uiState is default', async () => {
            const { container } = Component({});
            expect(container.findByType(MasterClassesScreen)).toHaveProp('containerOptions','MASTER_CLASS_CONTAINER');
        });
    });

    it('Should able to populate values from redux', () => {
        expect(
            mapStateToProps({
                player: {
                    hasVideoPaused: false,
                },
                masterClassesProgress: {
                    loading: true,
                    masterClassesFinishedDates: undefined,
                },
            }),
        ).toEqual({
            loading: true,
            masterClassesFinishedDates: undefined,
            takenIntroSittings: false,
            hasVideoPaused: false,
            uiState: undefined,
            showContinueButton: undefined,
            showHomeButton: undefined,
            enableContinueButton: undefined,
            enableHomeButton: undefined,
            unlockedState: {
                introductionAboutMasterClasses: false,
                day1: false,
                day2: false,
                day3: false,
            },
        });
    });

    describe('#MasterClassProgressSummaryVideoCards', () => {
        it('Should call MasterClassProgressService goToDay2 event when video card is pressed in MasterClassesProgressSummary', () => {
            const goToDay2Mock = jest
                .spyOn(
                    MasterClassProgressService,
                    'goToDay2',
                )
                .mockImplementation(() => {});

            const { container } = Component({
                uiState: 'MASTER_CLASS_PROGRESS_SUMMARY',
                masterClassSelectedLanguage: 'en',
                masterClassesFinishedDates: masterClassesFinishedDatesMock,
                unlockedState: videoUnlockedStateMock,
                takenIntroSittings: false,
                masterClassContent: MASTERCLASS_VIDEOS.DAY2,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress', 'day2');
            expect(goToDay2Mock).toBeCalled();
        });

        it('Should display toast message when video card is pressed in MasterClassesProgressSummary and video is in locked state', () => {
            const { container } = Component({
                takenIntroSittings: false,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
            'day2',
            'true',
            'Mock Message');
            expect(toastMock).toHaveBeenCalled();
        });

        it('Should call IntroductionOfMasterClass when master class IntroductionOfMasterClass card is pressed', async () => {
            const setMasterClassHomeButtonEnabledMock = jest.fn();
            const goToIntroductionOfMasterClassMock = jest
                .spyOn(
                    MasterClassProgressService,
                    'goToIntroductionOfMasterClass',
                )
                .mockImplementation(() => {});
            const { container } = Component({
                setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
            MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS,
            'false');
            expect(goToIntroductionOfMasterClassMock).toBeCalled();
        });
        it('Should call RequestToGoToDay1 when master class DAY1 card is pressed', async () => {
            const setMasterClassHomeButtonEnabledMock = jest.fn();
            const goToDay1Mock = jest
                .spyOn(MasterClassProgressService, 'goToDay1')
                .mockImplementation(() => {});
            const { container } = Component({
                setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
            MASTERCLASS_VIDEOS.DAY1,
            'false');
            expect(goToDay1Mock).toBeCalled();
        });
        it('Should call RequestToGoToDay2 when master class DAY2 card is pressed', async () => {
            const setMasterClassHomeButtonEnabledMock = jest.fn();
            const goToDay2Mock = jest
                .spyOn(MasterClassProgressService, 'goToDay2')
                .mockImplementation(() => {});
            const { container } = Component({
                setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
            MASTERCLASS_VIDEOS.DAY2,
            'false');
            expect(goToDay2Mock).toBeCalled();
        });
        it('Should call RequestToGoToDay3 when master class DAY3 card is pressed', async () => {
            const setMasterClassHomeButtonEnabledMock = jest.fn();
            const goToDay3Mock = jest
                .spyOn(MasterClassProgressService, 'goToDay3')
                .mockImplementation(() => {});
            const { container } = Component({
                setMasterClassHomeButtonEnabled: setMasterClassHomeButtonEnabledMock,
            });
            fireEvent(container.findByType(MasterClassesScreen), 'MasterClassProgressSummaryVideoCardPress',
            MASTERCLASS_VIDEOS.DAY3,
            'false');
            expect(goToDay3Mock).toBeCalled();
        });
    });
});
