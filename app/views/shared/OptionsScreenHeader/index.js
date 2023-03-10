import React, { Component } from 'react';
import { View } from 'react-native';
import { styles as optionsStyle } from './OptionsScreenHeader.styles';
import { withTranslation } from 'react-i18next';
import { MediumBoldText } from '../Text';
import BackButton from '../BackButton';
import { isEmpty, isUndefined, get } from 'lodash';
import { withTheme } from '../../../styles/theme/WithThemeHOC';

class OptionsScreenHeader extends Component {
    _handleOnBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _renderHeaderTitle = () => {
        const { title, styles, headerTextStyle } = this.props;
        if (!isEmpty(title) && !isUndefined(title)) {
            return (
                <View style={styles.centerContainer}>
                    <MediumBoldText
                        style={[styles.headerText, headerTextStyle]}>
                        {title}
                    </MediumBoldText>
                </View>
            );
        }
        return null;
    };
    render() {
        const { styles } = this.props;
        const style = get(this.props, 'style', {});
        const headerStyle = [styles.container, style];
        return (
            <View style={headerStyle}>
                <View style={styles.leftContainer}>
                    <BackButton
                        style={styles.backButton}
                        onBackPress={this._handleOnBackPress}
                    />
                </View>
                {this._renderHeaderTitle()}
                <View style={styles.rightContainer} />
            </View>
        );
    }
}
export default withTranslation()(withTheme(OptionsScreenHeader, optionsStyle));
