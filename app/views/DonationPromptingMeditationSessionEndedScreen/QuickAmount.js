import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles as donationPromptingMeditationSessionEndedScreenStyles } from './DonationPromptingMeditationSessionEndedScreen.styles';
import { View } from 'native-base';
import { Text } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class QuickAmount extends Component {
    _onQuickAmountPress = () => {
        const { amount, onQuickAmountPress } = this.props;
        onQuickAmountPress(amount);
    };
    render() {
        const { amount, styles } = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this._onQuickAmountPress}>
                    <View style={styles.quickAmount}>
                        <Text style={styles.quickAmountText}>{amount}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTheme(
    QuickAmount,
    donationPromptingMeditationSessionEndedScreenStyles,
);
