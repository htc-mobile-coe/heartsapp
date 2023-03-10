import React from 'react';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';
import HomeScreen from './HomeScreen';
import Header from './Header';
import AgeConsentPopup from '../shared/AgeConsentPopup';
import WhatsNewPopup from './WhatsNewPopup';
import PreceptorDashboardCard from './PreceptorDashboardCard';
import SessionCountCard from './SessionCountCard';
import SessionConductedByYouCountCard from './SessionConductedByYouCountCard';
import AvailableForSittingsWarningPopup from './AvailableForSittingsWarningPopup';
import BigCardButton from './BigCardButton';
import { MediumBoldText } from '../shared/Text';
import OfflineSessionTrackingPopup from './OfflineSessionTrackingPopup';
import HeartInTuneFloatingButton from './HeartInTuneFloatingButton/HeartInTuneFloatingButton';
describe('HomeScreen', () => {
    const meditateWithTrainerButton = 'homeScreen__meditateWithTrainer--button';
    const basicPracticeIntroductorySessionButton =
        'homeScreen__basicPracticeIntroductorySession--button';
    const learnToMeditateButton = 'homeScreen__learnToMeditate--button';
    const lifeStyleButton = 'homeScreen__lifeStyle--button';
    const meditatorImage = 'homeScreen__meditatorImage--image';
    const preceptorSessionCountThroughHeartsAppCardAddButtonPress =
        'homeScreen__preceptorDashboardCard--sessionCountThroughHeartsAppCard-onAddButtonPress'
    const globalMapText = 'homeScreen__globalMap--text';
    const globalMapImage = 'homeScreen__globalMap--image';
    const preceptorSessionCountThroughHeartsAppCard =
        'homeScreen__preceptorDashboardCard--sessionCountThroughHeartsAppCard';
    const preceptorOfflineSessionCountCard =
        'homeScreen__preceptorDashboardCard--offlineSessionCountCard';
    const heartInTuneBanner = 'homeScreen__heartInTuneBanner';
    const heartInTuneAppDownloadPopup =
        'homeScreen__heartInTuneAppDownloadPopup';

    const Component = (props) => render(<HomeScreen
        spotLightImageContent={{ image: 'learn_to_meditate_spotlight_image' }} {...props} />);


    it('Should able to render Header', () => {
        const { container } = Component({
            showHeartInTuneAppDownloadPopup: true
        });
        expect(container.findAllByType(Header)).toHaveLength(1);
    });
    it('should fire meditate with trainer press event, when Meditate with trainer pressed', () => {
        const meditateWithTrainerPressMock = jest.fn();
        const { container } = Component({
            canSignOut: true,
            showHeartInTuneAppDownloadPopup: true,
            onMeditateWithTrainerPress: meditateWithTrainerPressMock,
        });
        fireEvent.press(find(container, meditateWithTrainerButton), 'Press');
        expect(meditateWithTrainerPressMock).toHaveBeenCalled();
    });

    it('should fire basic practice introductory session press event, when Basic practice introductory session pressed', () => {
        const onBasicPracticeIntroductorySessionPressMock = jest.fn();
        const { container } = Component({
            onBasicPracticeIntroductorySessionPress: onBasicPracticeIntroductorySessionPressMock,
            showHeartInTuneAppDownloadPopup: true
        });
        fireEvent.press(find(container, basicPracticeIntroductorySessionButton), 'Press');
        expect(onBasicPracticeIntroductorySessionPressMock).toHaveBeenCalled();
    });

    it('should fire learn to meditate press event, when Learn to meditate pressed', () => {
        const onLearnToMeditatePressMock = jest.fn();
        const { container } = Component({
            onLearnToMeditatePress: onLearnToMeditatePressMock,
            showLearnToMeditateCard: true,
            showHeartInTuneAppDownloadPopup: true
        });
        fireEvent.press(find(container, learnToMeditateButton), 'Press');
        expect(onLearnToMeditatePressMock).toHaveBeenCalled();
    });
    it('should fire life style press event, when Life style pressed', () => {
        const onLifeStylePressMock = jest.fn();
        const { container } = Component({
            onMasterClassPress: onLifeStylePressMock,
            onLifeStylePress: onLifeStylePressMock,
            showHeartInTuneAppDownloadPopup: true
        });
        fireEvent.press(find(container, lifeStyleButton), 'Press');
        expect(onLifeStylePressMock).toHaveBeenCalled();
    });

    it('Header Should render -Hello !- text passed as parameter ', () => {
        const { container } = Component({
            userName: 'Hello !',
            showHeartInTuneAppDownloadPopup: true
        });
        expect(
            findByProps(
                container,
                'userName',
                'Hello !',
            ),
        ).toBeDefined();
    });

    it('Should call onSignInPress when user clicks on Headers SignIn button', () => {
        const onSignInPressMock = jest.fn();
        const { container } = Component({
            onSignInPress: onSignInPressMock,
            showHeartInTuneAppDownloadPopup: true
        });
        const header = container.findByType(Header);
        expect(header).toBeDefined();
        fireEvent(header, 'SignIn');
        expect(onSignInPressMock).toHaveBeenCalled();
    });

    it('Should call onSignOutPress when user clicks on Headers SignOut button', () => {
        const onSignOutPressMock = jest.fn();
        const { container } = Component({
            onSignOutPress: onSignOutPressMock,
            showHeartInTuneAppDownloadPopup: true
        });
        const header = container.findByType(Header);
        expect(header).toBeDefined();
        fireEvent(header, 'SignOut');
        expect(onSignOutPressMock).toHaveBeenCalled();
    });

    it('Should call onProfilePress when user clicks on Headers profile image button', () => {
        const onProfilePressMock = jest.fn();
        const { container } = Component({
            onProfilePress: onProfilePressMock,
            showHeartInTuneAppDownloadPopup: true
        });
        const header = container.findByType(Header);
        expect(header).toBeDefined();
        fireEvent(header, 'ProfilePress');
        expect(onProfilePressMock).toHaveBeenCalled();
    });

    it('Should have a AgeConsentPopup component', () => {
        const { container } = Component({
            showAgeConsentPopUp: true,
            showHeartInTuneAppDownloadPopup: true
        });
        expect(container.findAllByType(AgeConsentPopup)).toHaveLength(1);
    });

    it('Should have a WhatsNewPopup component', () => {
        const { container } = Component({
            showWhatsNewPopup: true,
            whatsNewDescription: 'test',
            showHeartInTuneAppDownloadPopup: true
        });
        expect(container.findAllByType(WhatsNewPopup)).toBeDefined()
    });

    it('Should have a OfflineSessionTrackingPopup component', () => {
        const { container } = Component({
            showOfflineSessionTrackingPopup: true,
            showHeartInTuneAppDownloadPopup: true
        });
        expect(container.findAllByType(OfflineSessionTrackingPopup)).toHaveLength(1);
    });
    it('Should have a HeartInTuneFloatingButton component', () => {
        const imageMock = {
            heartInTuneImage: 8
        };
        const { container } = Component({ showHeartInTuneAppDownloadPopup: false, images: imageMock, });
        expect(container.findAllByType(HeartInTuneFloatingButton)).toHaveLength(1);
    });
    it('Should have a PreceptorDashboardCard component', () => {
        const { container } = Component({
            isPreceptor: true,
        });
        expect(container.findAllByType(PreceptorDashboardCard)).toHaveLength(1);
    });

    it('Should have 1 MediumBoldText', () => {
        const { container } = Component({
            isPreceptor: true,
        });
        expect(container.findAllByType(MediumBoldText)).toBeDefined()
    });
    it('Should call onAddOfflineSittingPress when user press addOfflineSittingButton', () => {
        const onAddOfflineSittingPressMock = jest.fn();
        const { container } = Component({
            onAddOfflineSittingPress: onAddOfflineSittingPressMock,
            isPreceptor: true,
        });
        const test = find(container, preceptorSessionCountThroughHeartsAppCardAddButtonPress)
        fireEvent(test, 'AddButtonPress');
        expect(onAddOfflineSittingPressMock).toHaveBeenCalled();
    });
    it('Should have a AvailableForSittingsWarningPopup component', () => {
        const { container } = Component({
            showAvailableForSittingsWarningPopUp: true,
        });
        expect(container.findAllByType(AvailableForSittingsWarningPopup)).toHaveLength(
            1,
        );
    });

    it('Should have 5 BigCardButton component', () => {
        const { container } = Component({ showLearnToMeditateCard: true });
        expect(container.findAllByType(BigCardButton)).toHaveLength(5);
    });

    it('Should have 2 SessionConductedByYouCountCard and 1 SessionCountCard component when user is preceptor', () => {
        const { container } = Component({
            isPreceptor: true,
            showSeekerSessionCountCard: true,
        });
        expect(container.findAllByType(SessionConductedByYouCountCard)).toHaveLength(2);
        expect(container.findAllByType(SessionCountCard)).toHaveLength(1);
    });

    it('Should have 1 SessionCountCard component when user is seeker and showSeekerSessionCountCard is true', () => {
        const { container } = Component({
            showSeekerSessionCountCard: true,
        });
        expect(container.findAllByType(SessionCountCard)).toHaveLength(1);
    });

    it('Should have two Image component', () => {
        const { container } = Component({
            showMeditatorImage: true,
        });
        expect(find(container, meditatorImage)).toBeDefined()
        expect(find(container, globalMapImage)).toBeDefined()
    });

    it('Should render meditation image source ', () => {
        const imageMock = require('./img/classic/meditator.png');
        const { container } = Component({
            showMeditatorImage: true,
            images: imageMock,
        });
        const meditatorImageSection = find(container, meditatorImage)
        expect(meditatorImageSection).toBeDefined()
        expect(
            findByProps(
                meditatorImageSection,
                'source',
                imageMock,
            ),
        ).toBeDefined();
    });
    it('Should have a global title text', () => {
        const { container } = Component({
        });
        expect(find(container, globalMapText)).toBeDefined();
    });
    it('Should have a global map image', () => {
        const { container } = Component({});
        expect(find(container, globalMapImage)).toBeDefined();
    });

    it('Should call onMeditationSessionCountPress event when preceptorSessionCountThroughHeartsAppCard is pressed', () => {
        const onMeditationSessionCountPressMock = jest.fn();
        const { container } = Component({
            isPreceptor: true,
            onMeditationSessionCountPress: onMeditationSessionCountPressMock,
        });
        const preceptorSessionCountThroughHeartsAppCardSection = find(container, preceptorSessionCountThroughHeartsAppCard)
        fireEvent(preceptorSessionCountThroughHeartsAppCardSection, 'Press');
        expect(onMeditationSessionCountPressMock).toHaveBeenCalledWith(
            'THROUGH_HEARTSAPP',
        );
    });
    it('Should fire onMeditationSessionCountPress event when preceptorOfflineSessionCountCard is pressed', () => {
        const onMeditationSessionCountPressMock = jest.fn();
        const { container } = Component({
            isPreceptor: true,
            onMeditationSessionCountPress: onMeditationSessionCountPressMock,
        });
        const preceptorSessionCountThroughHeartsAppCardSection = find(container, preceptorOfflineSessionCountCard)
        fireEvent(preceptorSessionCountThroughHeartsAppCardSection, 'Press');
        expect(onMeditationSessionCountPressMock).toHaveBeenCalledWith(
            'OUT_SIDE_HEARTSAPP',
        );
    });
    it('Should render imageSource for HeartInTuneFloatingButton', () => {
        const heartInTuneImage = require('./img/classic/heartInTune.png');
        const { container } = Component({
            images: {
                heartInTuneImage: heartInTuneImage,
            },
            showHeartInTuneAppDownloadPopup: false
        });
        expect(container.findByType(HeartInTuneFloatingButton)).toHaveProp('imageSource', heartInTuneImage)
    });
    it('Should render floatingButtonShouldRevertToDefaultPosition for HeartInTuneFloatingButton', () => {
        const { container } = Component({
            floatingButtonShouldRevertToDefaultPosition: true,
            showHeartInTuneAppDownloadPopup: false
        });
        expect(container.findByType(HeartInTuneFloatingButton)).toHaveProp('floatingButtonShouldRevertToDefaultPosition', true)
    });
    it('Should able to call onSelectIcon in HeartInTune FloatingButton', () => {
        const onHeartInTuneFloatingButtonPressMock = jest.fn();
        const { container } = Component({
            onHeartInTuneFloatingButtonPress: onHeartInTuneFloatingButtonPressMock,
            showHeartInTuneAppDownloadPopup: false
        });
        fireEvent(container.findByType(HeartInTuneFloatingButton), 'onSelectIcon');

        expect(onHeartInTuneFloatingButtonPressMock).toBeCalled();
    });

    it('Should render a HeartInTuneBanner, when showHeartInTuneBanner is true', () => {
        const { container } = Component({
            showHeartInTuneBanner: true,
        });
        expect(find(container, heartInTuneBanner)).toBeDefined()
    });

    it('Should render a HeartInTuneAppDownloadPopup, when showHeartInTuneAppDownloadPopup is true', () => {
        const { container } = Component({
            showHeartInTuneAppDownloadPopup: true,
        });
        expect(find(container, heartInTuneAppDownloadPopup)).toBeDefined();
    });
    it('Should fire onDrag event, when floating button is dragged ', () => {
        const onDragHeartInTuneFloatingButtonMock = jest.fn();
        const { container } = Component({
            onDragHeartInTuneFloatingButton: onDragHeartInTuneFloatingButtonMock,
            showHeartInTuneAppDownloadPopup: false,
            isScroll: false
        });
        fireEvent(container.findByType(HeartInTuneFloatingButton), 'onDrag');
        expect(findByProps(container, 'isScroll', false)).toBeDefined();
        expect(onDragHeartInTuneFloatingButtonMock).toHaveBeenCalled();
    });
    it('Should fire onDragRelease event, when floating button dragging is released ', () => {
        const onDragReleaseHeartInTuneFloatingButtonMock = jest.fn();
        const { container } = Component({
            onDragReleaseHeartInTuneFloatingButton: onDragReleaseHeartInTuneFloatingButtonMock,
            showHeartInTuneAppDownloadPopup: false,
            isScroll: true
        });
        fireEvent(container.findByType(HeartInTuneFloatingButton), 'onDragRelease');
        expect(findByProps(container, 'isScroll', true)).toBeDefined();
        expect(onDragReleaseHeartInTuneFloatingButtonMock).toHaveBeenCalled();
    });
});
