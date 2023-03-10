import React, { Component } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { styles as backButtonStyle } from './BackButton.styles';
import { ArrowLeft } from '../Icon';
import { withTheme } from '../../../styles/theme/WithThemeHOC';

class BackButton extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this._handleBackPress}
                    testID="backButton--touchableOpacity"
                    style={styles.touchableOpacity}>
                    <ArrowLeft style={styles.backIcon} />
                </TouchableOpacity>
            </View>
        );
    }
}
export default withTheme(BackButton, backButtonStyle);
