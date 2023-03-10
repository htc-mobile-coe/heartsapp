import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { styles as practicesStyle } from './BasicPracticesScreen.styles';
import { View } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import VideoCard from '../shared/VideoCard/VideoCard';
import { BASIC_PRACTICES_VIDEOS } from '../../shared/Constants';
import Images from './img';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

class BasicPracticesScreen extends Component {
    _renderHeader = () => {
        const { config, selectedLanguage, onBackPress, styles } = this.props;
        const { heading } = config[selectedLanguage];

        return (
            <OptionsScreenHeader
                testID="basicPracticesScreen_back--button"
                title={heading}
                style={styles.headerContainer}
                headerTextStyle={styles.headerText}
                onBackPress={onBackPress}
            />
        );
    };

    _renderCard = (configProp, id) => {
        const {
            config,
            selectedLanguage,
            expandedCard,
            onPlayPress,
            onExpandPress,
            onSelectedLanguageChange,
        } = this.props;

        const { languages } = config;

        const data = config[selectedLanguage][configProp];
        const { titlePart2, previewImageURL, duration } = data;

        return (
            <VideoCard
                titlePart2={titlePart2}
                image={Images[previewImageURL]}
                duration={duration}
                languages={languages}
                selectedLanguage={selectedLanguage}
                expanded={expandedCard === id}
                cardID={id}
                locked={false}
                onPlayPress={onPlayPress}
                onExpandPress={onExpandPress}
                data={data}
                onSelectedLanguageChange={onSelectedLanguageChange}
                canChangeLanguage={true}
            />
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer>
                <View style={styles.mainView}>
                    {this._renderHeader()}
                    <View style={styles.bodyContainer}>
                        {this._renderCard(
                            'relaxation',
                            BASIC_PRACTICES_VIDEOS.RELAXATION,
                        )}
                        {this._renderCard(
                            'meditation',
                            BASIC_PRACTICES_VIDEOS.MEDITATION,
                        )}
                        {this._renderCard(
                            'cleaning',
                            BASIC_PRACTICES_VIDEOS.CLEANING,
                        )}
                        {this._renderCard(
                            'prayer',
                            BASIC_PRACTICES_VIDEOS.PRAYER,
                        )}
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(BasicPracticesScreen, practicesStyle),
);
