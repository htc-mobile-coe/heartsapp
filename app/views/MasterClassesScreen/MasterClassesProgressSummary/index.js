import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { styles as MasterClassesProgressSummaryStyle } from './MasterClassesProgressSummary.styles';
import { ScrollView, View } from 'react-native';
import MasterClassesIntro from './MasterClassesIntro';
import MasterClassesVideoInfo from './MasterClassesVideoInfo';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { find } from 'lodash';
import Images from './img';
import MasterClassInfo from '../MasterClassInfo';

class MasterClassesProgressSummary extends Component {
    state = {
        showExpandedIntroView: false,
    };

    _handleMeetDaajiButtonPress = () => {
        this.setState({ showExpandedIntroView: true });
    };

    _handleToggleUpButtonPress = () => {
        this.setState({ showExpandedIntroView: false });
    };

    _renderMasterClassesIntro = () => {
        const {
            styles,
            config,
            selectedLanguage,
            onBackPress,
            onMasterClassProgressSummaryInfoPress,
        } = this.props;
        const masterClassesData = config[selectedLanguage];
        const data = find(masterClassesData, {
            id: 'masterClassesProgressSummary',
        });

        const {
            introToMasterClassesPoints,
            meetDaajiButtonTitle,
            infoAboutDaaji,
            introAboutDaaji,
        } = data;
        return (
            <View style={styles.contentContainerStyle}>
                <MasterClassesIntro
                    points={introToMasterClassesPoints}
                    meetDaajiButtonTitle={meetDaajiButtonTitle}
                    infoAboutDaaji={infoAboutDaaji}
                    introAboutDaaji={introAboutDaaji}
                    daajiSmallIcon={Images.daajiCollapse}
                    daajiLargeIcon={Images.daajiExpanded}
                    showExpandedIntroView={this.state.showExpandedIntroView}
                    onMeetDaajiButtonPress={this._handleMeetDaajiButtonPress}
                    onToggleUpButtonPress={this._handleToggleUpButtonPress}
                    onBackPress={onBackPress}
                    onMasterClassProgressSummaryInfoPress={
                        onMasterClassProgressSummaryInfoPress
                    }
                />
            </View>
        );
    };

    _renderMasterClassesVideoInfo = () => {
        const {
            styles,
            config,
            selectedLanguage,
            takenIntroSittings,
            masterClassesFinishedDates,
            unlockedState,
            onMasterClassProgressSummaryVideoCardPress,
        } = this.props;
        const masterClassesData = config[selectedLanguage];

        return (
            <View style={styles.videoInfoContainerStyle}>
                <MasterClassesVideoInfo
                    masterClassesData={masterClassesData}
                    takenIntroSittings={takenIntroSittings}
                    masterClassesFinishedDates={masterClassesFinishedDates}
                    unlockedState={unlockedState}
                    onMasterClassProgressSummaryVideoCardPress={
                        onMasterClassProgressSummaryVideoCardPress
                    }
                />
            </View>
        );
    };

    render() {
        const {
            styles,
            showMasterClassInfo,
            onMasterClassInfoBackPress,
            config,
            selectedLanguage,
        } = this.props;
        const data = config[selectedLanguage];
        const {
            infoTitle,
            infoHeading,
            infoFirstSectionTitle,
            infofirstSectionPoints,
            infoSecondSectionTitle,
            infoSecondSectionPoints,
        } = data;
        if (showMasterClassInfo) {
            return (
                <MasterClassInfo
                    title={infoTitle}
                    headingText={infoHeading}
                    firstSectionTitle={infoFirstSectionTitle}
                    firstSectionPoints={infofirstSectionPoints}
                    secondSectionTitle={infoSecondSectionTitle}
                    secondSectionPoints={infoSecondSectionPoints}
                    onBackPress={onMasterClassInfoBackPress}
                />
            );
        }
        return (
            <ScrollView style={styles.container}>
                {this._renderMasterClassesIntro()}
                {this._renderMasterClassesVideoInfo()}
            </ScrollView>
        );
    }
}

export default withTranslation()(
    withTheme(MasterClassesProgressSummary, MasterClassesProgressSummaryStyle),
);
