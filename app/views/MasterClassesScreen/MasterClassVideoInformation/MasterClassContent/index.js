import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { View, Select } from 'native-base';
import { Text, BoldText, MediumBoldText } from '../../../shared';
import { isEmpty, map } from 'lodash';
import { styles as masterClassContentCardStyles } from './MasterClassContentCard.styles';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import { Button } from '../../../shared';
import { ArrowDown } from '../../../shared/Icon';
const Item = Select.Item;

class MasterClassContent extends Component {
    _handleContinueButtonPress = () => {
        const { onContinueButtonPress, data } = this.props;
        onContinueButtonPress(data);
    };
    _handleLearnMorePress = () => {
        const { onLearnMorePress } = this.props;
        onLearnMorePress();
    };
    _renderDropdownItems = () => {
        const { languages } = this.props;
        return map(languages, language => (
            <Item
                key={language.value}
                label={language.label}
                value={language.value}
            />
        ));
    };
    _renderIosIcon = () => {
        const { styles } = this.props;
        return <ArrowDown style={styles.iosIcon} />;
    };

    _renderDropdown = () => {
        const {
            selectedLanguage,
            languages,
            styles,
            onSelectedLanguageChange,
            showLanguagePicker,
        } = this.props;

        if (!isEmpty(languages) && showLanguagePicker) {
            return (
                <View style={styles.languageContainer}>
                    <Select
                        style={[styles.dropDown, styles.languageTextStyle]}
                        iosHeader="Select one"
                        iosIcon={this._renderIosIcon()}
                        mode="dropdown"
                        selectedValue={selectedLanguage}
                        onValueChange={onSelectedLanguageChange}
                        testID={'masterClassContentCard-language--picker'}>
                        {this._renderDropdownItems()}
                    </Select>
                </View>
            );
        }
    };

    _renderHeadingContainer = () => {
        const { styles, heading, dayTitle } = this.props;

        if (!isEmpty(dayTitle)) {
            return (
                <View style={styles.headerContainer}>
                    <Text
                        style={styles.heading}
                        testID={'masterClassContentCard-header--text'}>
                        {heading}
                    </Text>
                    <View style={styles.dayTitleContainer}>
                        <MediumBoldText
                            style={styles.dayTitle}
                            testID={'masterClassContentCard-dayTitle--text'}>
                            {dayTitle}
                        </MediumBoldText>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.headerContainer}>
                <Text
                    style={styles.heading}
                    testID={'masterClassContentCard-header--text'}>
                    {heading}
                </Text>
            </View>
        );
    };

    _renderInformationContainer = () => {
        const { styles, title } = this.props;

        return (
            <View style={styles.informationContainer}>
                <MediumBoldText
                    style={styles.title}
                    testID={'masterClassContentCard-title--text'}>
                    {title}
                </MediumBoldText>
                {this._renderDropdown()}
            </View>
        );
    };

    _renderDescriptionContainer = () => {
        const {
            styles,
            highlightedDescription,
            endDescription,
            description,
        } = this.props;
        return (
            <View style={styles.descriptionContainer}>
                <Text>
                    <Text
                        style={styles.primaryColorText}
                        testID={
                            'masterClassContentCard-primaryDescription--text'
                        }>
                        {description}
                    </Text>
                    <BoldText
                        style={styles.highlightedText}
                        testID={
                            'masterClassContentCard-highlightedDescription--text'
                        }>
                        {' '}
                        {highlightedDescription}{' '}
                    </BoldText>
                    <Text
                        style={styles.primaryColorText}
                        testID={'masterClassContentCard-endDescription--text'}>
                        {endDescription}
                    </Text>
                </Text>
            </View>
        );
    };

    _renderLearnMoreButton = () => {
        const { styles, learnMore } = this.props;
        if (!isEmpty(learnMore)) {
            return (
                <View style={styles.learnMoreButton}>
                    <TouchableOpacity
                        testID="masterClassContentCard-learnMore--TouchableOpacity"
                        style={styles.learnMoreButtonStyle}
                        onPress={this._handleLearnMorePress}>
                        <MediumBoldText
                            style={styles.learnMoreTextStyle}
                            testID={'masterClassContentCard-learnMore--text'}>
                            {learnMore}
                        </MediumBoldText>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    _renderContinueButton = () => {
        const {
            styles,
            continueButtonTitle,
            enableContinueButton,
        } = this.props;
        const continueButtonStyle = enableContinueButton
            ? styles.continueButton
            : styles.disableContinueButton;
        return (
            <View style={styles.buttonContainer}>
                <Button
                    rounded={true}
                    style={continueButtonStyle}
                    onPress={this._handleContinueButtonPress}
                    text={continueButtonTitle}
                    testID="masterClassContentCard__continue--button"
                />
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScrollView
                testID="masterClassContentCard__scrollView"
                style={styles.container}>
                {this._renderHeadingContainer()}
                <View style={styles.headerLine} />
                {this._renderInformationContainer()}
                {this._renderDescriptionContainer()}
                {this._renderLearnMoreButton()}
                {this._renderContinueButton()}
            </ScrollView>
        );
    }
}

export default withTheme(MasterClassContent, masterClassContentCardStyles);
