import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ScreenContainer from '../shared/ScreenContainer';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import IntroductionToHFNMeditation from './IntroductionToHFNMeditation';
import MasterClassesProgressSummary from './MasterClassesProgressSummary';
import MasterClassVideoInformation from './MasterClassVideoInformation';
import { NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS } from './MasterClassContainerOptions';
import MasterClassCompletionComponent from './MasterClassCompletionComponent';
import { StatusBar } from 'react-native';

class MasterClassesScreen extends Component {
    _renderIntroductionToHFNMeditation = () => {
        const {
            onIntroductionToHFNMeditationNextPress,
            onBackPress,
        } = this.props;
        return (
            <IntroductionToHFNMeditation
                onNextPress={onIntroductionToHFNMeditationNextPress}
                onBackButtonPress={onBackPress}
            />
        );
    };
    _renderMasterClassesProgressSummary = () => {
        const {
            masterClassConfig,
            masterClassSelectedLanguage,
            onBackPress,
            takenIntroSittings,
            masterClassesFinishedDates,
            unlockedState,
            onMasterClassProgressSummaryInfoPress,
            onMasterClassProgressSummaryVideoCardPress,
            showMasterClassInfo,
            onMasterClassInfoBackPress,
        } = this.props;
        return (
            <MasterClassesProgressSummary
                config={masterClassConfig}
                selectedLanguage={masterClassSelectedLanguage}
                onBackPress={onBackPress}
                takenIntroSittings={takenIntroSittings}
                masterClassesFinishedDates={masterClassesFinishedDates}
                unlockedState={unlockedState}
                onMasterClassProgressSummaryInfoPress={
                    onMasterClassProgressSummaryInfoPress
                }
                onMasterClassProgressSummaryVideoCardPress={
                    onMasterClassProgressSummaryVideoCardPress
                }
                showMasterClassInfo={showMasterClassInfo}
                onMasterClassInfoBackPress={onMasterClassInfoBackPress}
            />
        );
    };
    _renderMasterClassVideoInformation = () => {
        const {
            masterClassConfig,
            masterClassSelectedLanguage,
            onSelectedLanguageChange,
            onLearnMorePress,
            onContinueButtonPress,
            masterClassContent,
            enableContinueButton,
            onPlayPress,
            onBackPress,
            showLearnMore,
            onLearnMoreBackPress,
        } = this.props;
        return (
            <MasterClassVideoInformation
                config={masterClassConfig}
                selectedLanguage={masterClassSelectedLanguage}
                onSelectedLanguageChange={onSelectedLanguageChange}
                onLearnMorePress={onLearnMorePress}
                onContinueButtonPress={onContinueButtonPress}
                content={masterClassContent}
                enableContinueButton={enableContinueButton}
                onPlayPress={onPlayPress}
                onBackPress={onBackPress}
                showLearnMore={showLearnMore}
                onLearnMoreBackPress={onLearnMoreBackPress}
            />
        );
    };
    _renderMasterClassCompletionComponent = () => {
        const {
            enableContinueButton,
            enableHomeButton,
            masterClassCompletionContent,
            selectedMasterClassCompletionCardIndex,
            onCarouselCardPress,
            showHomeButton,
            showContinueButton,
            noOfCardsInCompletionScreen,
            onHomeButtonPress,
            onContinueButtonPress,
            onBackPress,
        } = this.props;
        return (
            <MasterClassCompletionComponent
                enableContinueButton={enableContinueButton}
                enableHomeButton={enableHomeButton}
                showHomeButton={showHomeButton}
                showContinueButton={showContinueButton}
                content={masterClassCompletionContent}
                currentPageIndex={selectedMasterClassCompletionCardIndex}
                noOfCards={noOfCardsInCompletionScreen}
                onCarouselCardPress={onCarouselCardPress}
                onHomeButtonPress={onHomeButtonPress}
                onContinueButtonPress={onContinueButtonPress}
                onBackPress={onBackPress}
            />
        );
    };

    _renderMasterClassInfo = () => {
        const {
            masterClassCompletionContent,
            enableContinueButton,
            enableHomeButton,
            showHomeButton,
            showContinueButton,
            onBackPress,
            onContinueButtonPress,
            onHomeButtonPress,
        } = this.props;
        return (
            <MasterClassCompletionComponent
                enableContinueButton={enableContinueButton}
                enableHomeButton={enableHomeButton}
                showHomeButton={showHomeButton}
                showContinueButton={showContinueButton}
                currentPageIndex={0}
                noOfCards={1}
                content={masterClassCompletionContent}
                onHomeButtonPress={onHomeButtonPress}
                onContinueButtonPress={onContinueButtonPress}
                onBackPress={onBackPress}
            />
        );
    };

    _renderContainer = () => {
        const { containerOptions } = this.props;
        switch (containerOptions) {
            case NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.INTRODUCTION_TO_HFN_MEDITATION_CONTAINER:
                return this._renderIntroductionToHFNMeditation();
            case NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER:
                return this._renderMasterClassesProgressSummary();
            case NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASS_INFO_CONTAINER:
                return this._renderMasterClassInfo();
            case NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASS_COMPLETION_CONTAINER:
                return this._renderMasterClassCompletionComponent();
            default:
                return this._renderMasterClassVideoInformation();
        }
    };
    render() {
        const { hideStatusBar } = this.props;
        return (
            <ScreenContainer
                enableScroll={false}
                enableSafeArea={!hideStatusBar}>
                <StatusBar animated={true} hidden={hideStatusBar} />
                {this._renderContainer()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(MasterClassesScreen));
