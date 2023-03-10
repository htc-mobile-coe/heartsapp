import React from 'react';
import MasterClassesScreen from './MasterClassesScreen';
import IntroductionToHFNMeditation from './IntroductionToHFNMeditation';
import MasterClassesProgressSummary from './MasterClassesProgressSummary';
import MasterClassCompletionComponent from './MasterClassCompletionComponent';
import MasterClassVideoInformation from './MasterClassVideoInformation';
import { render, fireEvent } from 'app/utils/TestUtils';
import { getMasterClassScreenConfig } from 'app/services/firebase/RemoteConfigService';
import { MASTERCLASS_VIDEOS } from '../../shared/Constants';

describe('MasterClassesScreen', () => {
    const masterClassesFinishedDatesMock = {
        introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
        day1: '2021-07-14T05:55:47.881Z',
        day2: null,
        day3: null,
    };
    const videoUnlockedStateMock = {
        introductionAboutMasterClasses: true,
        day1: true,
        day2: false,
        day3: false,
    };
    const Component = props => {
        return render(<MasterClassesScreen 
            {...props} 
            masterClassConfig={getMasterClassScreenConfig()}
            masterClassSelectedLanguage={'en'}
            masterClassesFinishedDates={masterClassesFinishedDatesMock}
            unlockedState={videoUnlockedStateMock}
            takenIntroSittings={false}
            masterClassContent={MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS}
        />);
    };

    it('Should exist', () => {
        const { container } = Component({
            containerOptions: 'MASTER_CLASS_CONTAINER',
        });
        expect(container).toBeDefined();
    });
    it('Should have a MasterClassVideoInformation component', () => {
        const { container } = Component({
            containerOptions: 'MASTER_CLASS_CONTAINER',
        });
        expect(container.findByType(MasterClassVideoInformation)).toBeDefined();
    });
    it('Should have a IntroductionToHFNMeditation component when container option is INTRODUCTION_TO_HFN_MEDITATION_CONTAINER', () => {
        const { container } = Component({
            containerOptions: 'INTRODUCTION_TO_HFN_MEDITATION_CONTAINER',
        });
        expect(container.findByType(IntroductionToHFNMeditation)).toBeDefined();
    });
    it('Should have a MasterClassesProgressSummary component when container option is MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER', () => {
        const { container } = Component({
            containerOptions: 'MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER',
        });
        expect(container.findByType(MasterClassesProgressSummary)).toBeDefined();
    });
    it('Should have a MasterClassCompletion component when container option is MASTER_CLASS_INFO_CONTAINER', () => {
        const { container } = Component({
            containerOptions: 'MASTER_CLASS_INFO_CONTAINER',
            masterClassCompletionContent: {
                title: 'mockTitle',
                subTitle: 'mockSubtitle',
                description1: 'description',
                description2: 'description',
        
                descriptionHighlightedText1: 'mockDescription',
                descriptionHighlightedText2: 'mockDescription',
                image: 'masterClass_day_1',
                descriptionFullStop: '.',
            },
        });
        expect(container.findByType(MasterClassCompletionComponent)).toBeDefined();
    });
    it('Should have a MasterClassCompletion component when container option is MASTER_CLASS_COMPLETION_CONTAINER', () => {
        const { container } = Component({
            containerOptions: 'MASTER_CLASS_COMPLETION_CONTAINER',
            masterClassCompletionContent: {
                title: 'mockTitle',
                subTitle: 'mockSubtitle',
                description1: 'description',
                description2: 'description',
        
                descriptionHighlightedText1: 'mockDescription',
                descriptionHighlightedText2: 'mockDescription',
                image: 'masterClass_day_1',
                descriptionFullStop: '.',
            },
        });
        expect(container.findByType(MasterClassCompletionComponent)).toBeDefined();
    });
    it('Should able to call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(MasterClassVideoInformation), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should able to call continue press event when user clicks on continue button', () => {
        const onContinueButtonPressMock = jest.fn();
        const { container } = Component({
            onContinueButtonPress: onContinueButtonPressMock,
        });
        fireEvent(container.findByType(MasterClassVideoInformation), 'ContinueButtonPress');
        expect(onContinueButtonPressMock).toHaveBeenCalled();
    });
    it('Should able to call play press event when user clicks on video to play', () => {
        const onPlayPressMock = jest.fn();
        const { container } = Component({
            onPlayPress: onPlayPressMock,
        });
        fireEvent(container.findByType(MasterClassVideoInformation), 'PlayPress');
        expect(onPlayPressMock).toHaveBeenCalled();
    });
    it('Should able to call onIntroductionToHFNMeditationNextPress when user clicks next in Introduction to HFN Component', () => {
        const onIntroductionToHFNMeditationNextPressMock = jest.fn();
        const { container } = Component({
            containerOptions: 'INTRODUCTION_TO_HFN_MEDITATION_CONTAINER',
            onIntroductionToHFNMeditationNextPress: onIntroductionToHFNMeditationNextPressMock,
        });
        fireEvent(container.findByType(IntroductionToHFNMeditation), 'NextPress');
        expect(onIntroductionToHFNMeditationNextPressMock).toHaveBeenCalled();
    });
    it('Should able to call MasterClassProgressSummaryVideoCardPress when user clicks on Video card in MasterClassesProgressSummary component', () => {
        const onMasterClassProgressSummaryVideoCardPressMock = jest.fn();
        const { container } = Component({
            containerOptions: 'MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER',
            onMasterClassProgressSummaryVideoCardPress: onMasterClassProgressSummaryVideoCardPressMock,
        });
        fireEvent(container.findByType(MasterClassesProgressSummary), 'MasterClassProgressSummaryVideoCardPress');
        expect(
            onMasterClassProgressSummaryVideoCardPressMock,
        ).toHaveBeenCalled();
    });
    it('Should able to call MasterClassProgressSummaryInfoPress when user clicks on info button in MasterClassesProgressSummary component', () => {
        const onMasterClassProgressSummaryInfoPressMock = jest.fn();
        const { container } = Component({
            containerOptions: 'MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER',
            onMasterClassProgressSummaryInfoPress: onMasterClassProgressSummaryInfoPressMock,
        });
        fireEvent(container.findByType(MasterClassesProgressSummary), 'MasterClassProgressSummaryInfoPress');
        expect(onMasterClassProgressSummaryInfoPressMock).toHaveBeenCalled();
    });
    it('Should able to call onHomeButtonPressMock when user clicks next on Home button', () => {
        const onHomeButtonPressMock = jest.fn();
        const { container } = Component({
            containerOptions: 'MASTER_CLASS_INFO_CONTAINER',
            masterClassCompletionContent: {
                title: 'mockTitle',
                subTitle: 'mockSubtitle',
                description1: 'description',
                description2: 'description',
        
                descriptionHighlightedText1: 'mockDescription',
                descriptionHighlightedText2: 'mockDescription',
                image: 'masterClass_day_1',
                descriptionFullStop: '.',
            },
            onHomeButtonPress: onHomeButtonPressMock,
        });
        fireEvent(container.findByType(MasterClassCompletionComponent), 'HomeButtonPress');
        expect(onHomeButtonPressMock).toHaveBeenCalled();
    });
    it('Should able to call onLearnMoreBackPress event when user clicks on back button in learn more', () => {
        const onLearnMoreBackPressMock = jest.fn();
        const { container } = Component({
            onLearnMoreBackPress: onLearnMoreBackPressMock,
        });
        fireEvent(container.findByType(MasterClassVideoInformation), 'LearnMoreBackPress');
        expect(onLearnMoreBackPressMock).toHaveBeenCalled();
    });
});
