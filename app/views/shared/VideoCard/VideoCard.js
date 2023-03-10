import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Select } from 'native-base';
import { styles as videoStyle } from './VideoCard.styles';
import { Lock, Play } from '../Icon';
import { Text, MediumBoldText } from '../Text';
import { map, isEmpty } from 'lodash';
import VideoCardHeader from './VideoCardHeader';
import CenterView from '../CenterView';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { withTranslation } from 'react-i18next';
const Item = Select.Item;

class VideoCard extends Component {
    _handleExpandPress = () => {
        const { onExpandPress, cardID } = this.props;

        if (onExpandPress) {
            onExpandPress(cardID);
        }
    };

    _handleIconPress = () => {
        const { onPlayPress, locked, data } = this.props;

        if (onPlayPress) {
            onPlayPress(data, locked);
        }
    };

    _renderPlayIcon = () => {
        const { testID, locked, styles } = this.props;

        if (locked) {
            return (
                <TouchableOpacity
                    onPress={this._handleIconPress}
                    testID={testID}
                    style={styles.iconCircle}>
                    <Lock style={styles.icon} />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                onPress={this._handleIconPress}
                testID={testID}
                style={styles.iconCircle}>
                <Play style={styles.icon} />
            </TouchableOpacity>
        );
    };

    _renderDurationContainer = () => {
        const { styles, t, duration } = this.props;

        return (
            <View style={styles.durationContainer}>
                <Text>
                    <MediumBoldText
                        style={styles.durationText}
                        testID={'videoCard-duration--text'}>
                        {t('videoCard:duration')}
                    </MediumBoldText>{' '}
                    <MediumBoldText
                        style={styles.durationText}
                        testID={'videoCard-durationTime--text'}>
                        {duration}
                    </MediumBoldText>
                </Text>
            </View>
        );
    };
    _renderVideoPreview = () => {
        const { image, styles } = this.props;

        return (
            <View style={styles.previewContainer}>
                <Image source={image} style={[styles.imageStyle]} />
                <View style={styles.iconContainer}>
                    <CenterView>{this._renderPlayIcon()}</CenterView>
                </View>
                {this._renderDurationContainer()}
            </View>
        );
    };

    _renderDescription = () => {
        const { description, styles } = this.props;

        return <Text style={styles.description}>{description}</Text>;
    };

    _renderActionButton = () => {
        const { action, styles } = this.props;

        if (action) {
            const { label, onActionPress } = action;

            return (
                <TouchableOpacity
                    testID="video_card_action_button"
                    style={styles.actionsContainer}
                    onPress={onActionPress}>
                    <Text style={styles.actionItem}>{label}</Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    _renderBody = () => {
        const { expanded } = this.props;

        if (expanded) {
            return (
                <>
                    {this._renderVideoPreview()}
                    {this._renderDropdown()}
                    {this._renderDescription()}
                    {this._renderActionButton()}
                </>
            );
        }

        return null;
    };

    _handleSelectedLanguageChange = (value) => {
        const { onSelectedLanguageChange } = this.props;

        if (onSelectedLanguageChange) {
            onSelectedLanguageChange(value);
        }
    };

    _renderDropdownItems = () => {
        const { languages } = this.props;
        return map(languages, (l) => (
            <Item key={l.label} label={l.label} value={l.value} />
        ));
    };

    _renderDropdown = () => {
        const { selectedLanguage, languages, canChangeLanguage, styles } =
            this.props;

        if (canChangeLanguage && !isEmpty(languages) && languages.length > 1) {
            return (
                <View style={styles.languageContainer}>
                    <View style={styles.languageDropDown}>
                        <Select
                            style={styles.dropDown}
                            iosHeader="Select one"
                            mode="dropdown"
                            selectedValue={selectedLanguage}
                            onValueChange={this._handleSelectedLanguageChange}>
                            {this._renderDropdownItems()}
                        </Select>
                    </View>
                </View>
            );
        }

        return null;
    };

    render() {
        const { titlePart1, titlePart2, expanded, styles } = this.props;

        return (
            <View style={styles.container}>
                <VideoCardHeader
                    titlePart1={titlePart1}
                    titlePart2={titlePart2}
                    canExpand={!expanded}
                    onExpandPress={this._handleExpandPress}
                />
                {this._renderBody()}
            </View>
        );
    }
}
export default withTranslation()(withTheme(VideoCard, videoStyle));
