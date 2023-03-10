import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { styles as MasterClassStyle } from './MasterClassVideoInformation.styles';
import { View, TouchableOpacity } from 'react-native';
import MasterClassVideoPreview from './MasterClassVideoPreview';
import { ArrowLeft } from '../../shared/Icon';
import MasterClassContent from './MasterClassContent';
import Images from './img';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { find, isEqual } from 'lodash';
import LearnMore from '../LearnMore';
import MasterClassInfo from '../MasterClassInfo';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';

class MasterClassVideoInformation extends Component {
    _renderMasterClassVideoCard = () => {
        const {
            config,
            selectedLanguage,
            onPlayPress,
            styles,
            onBackPress,
            content,
        } = this.props;
        const masterClassesData = config[selectedLanguage];
        const data = find(masterClassesData, { id: content });
        const { videoThumbnailURL, duration } = data;
        return (
            <View style={styles.videoCardContainer}>
                <MasterClassVideoPreview
                    videoThumbnailURL={Images[videoThumbnailURL]}
                    expanded={true}
                    locked={false}
                    onPlayPress={onPlayPress}
                    data={data}
                    duration={duration}
                />
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity
                        testID="masterClassesScreen_back--button"
                        style={styles.backButton}
                        onPress={onBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    _renderMasterClassContent = () => {
        const {
            styles,
            config,
            selectedLanguage,
            onSelectedLanguageChange,
            onLearnMorePress,
            onContinueButtonPress,
            content,
            enableContinueButton,
        } = this.props;
        const { languages } = config;
        const masterClassesData = config[selectedLanguage];
        const data = find(masterClassesData, { id: content });
        const heading = config[selectedLanguage].heading;
        const {
            title,
            day,
            description,
            highlightedDescription,
            endDescription,
            continueButtonTitle,
            learnMore,
            showLanguagePicker,
        } = data;
        return (
            <View style={styles.contentContainerStyle}>
                <MasterClassContent
                    heading={heading}
                    title={title}
                    dayTitle={day}
                    description={description}
                    highlightedDescription={highlightedDescription}
                    endDescription={endDescription}
                    continueButtonTitle={continueButtonTitle}
                    languages={languages}
                    learnMore={learnMore}
                    enableContinueButton={enableContinueButton}
                    showLanguagePicker={showLanguagePicker}
                    selectedLanguage={selectedLanguage}
                    onSelectedLanguageChange={onSelectedLanguageChange}
                    onLearnMorePress={onLearnMorePress}
                    onContinueButtonPress={onContinueButtonPress}
                    data={data}
                />
            </View>
        );
    };

    _renderContent = () => {
        const {
            showLearnMore,
            onLearnMoreBackPress,
            config,
            selectedLanguage,
            content,
            styles,
        } = this.props;
        const masterClassesData = config[selectedLanguage];
        const data = find(masterClassesData, { id: content });
        if (showLearnMore) {
            if (isEqual(content, MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS)) {
                const {
                    infoTitle,
                    infoHeading,
                    infoFirstSectionTitle,
                    infofirstSectionPoints,
                    infoSecondSectionTitle,
                    infoSecondSectionPoints,
                } = data;
                return (
                    <MasterClassInfo
                        title={infoTitle}
                        headingText={infoHeading}
                        firstSectionTitle={infoFirstSectionTitle}
                        firstSectionPoints={infofirstSectionPoints}
                        secondSectionTitle={infoSecondSectionTitle}
                        secondSectionPoints={infoSecondSectionPoints}
                        onBackPress={onLearnMoreBackPress}
                    />
                );
            } else {
                const {
                    learnMoreTitle,
                    learnMoreHeading,
                    learnMoreContent,
                    learnMorePoints,
                } = data;
                return (
                    <LearnMore
                        contentText={learnMoreContent}
                        points={learnMorePoints}
                        headingText={learnMoreHeading}
                        title={learnMoreTitle}
                        onLearnMoreBackPress={onLearnMoreBackPress}
                    />
                );
            }
        }
        return (
            <View style={styles.container}>
                {this._renderMasterClassVideoCard()}
                {this._renderMasterClassContent()}
            </View>
        );
    };
    render() {
        return this._renderContent();
    }
}

export default withTranslation()(
    withTheme(MasterClassVideoInformation, MasterClassStyle),
);
