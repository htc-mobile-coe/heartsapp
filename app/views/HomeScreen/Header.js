import React, { Component } from 'react';
import { View, Avatar } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { styles as headerStyle } from './Header.styles';
import { withTranslation } from 'react-i18next';
import { SignIn, SignOut } from '../shared/Icon';
import { MediumBoldText, Text } from '../shared';
import { isNull } from 'lodash';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class Header extends Component {
    _renderSignInIcon = () => {
        const { canSignOut, styles } = this.props;

        if (canSignOut) {
            return <SignOut style={styles.loginLogoutButton} />;
        }

        return <SignIn style={styles.loginLogoutButton} />;
    };

    _renderSignInButton = () => {
        const { canSignOut, onSignOut, onSignIn, t, styles } = this.props;
        const action = canSignOut ? onSignOut : onSignIn;
        const text = canSignOut
            ? t('HomeScreen:signOut')
            : t('HomeScreen:signIn');
        const testId = canSignOut
            ? 'homeScreen__signOut--button'
            : 'homeScreen__signIn--button';

        return (
            <TouchableOpacity onPress={action} testID={testId}>
                <View style={styles.loginLogoutIconContainer}>
                    {this._renderSignInIcon()}
                </View>
                <MediumBoldText style={styles.loginLogoutText}>
                    {text}
                </MediumBoldText>
            </TouchableOpacity>
        );
    };

    _renderUserData = () => {
        const { userName, styles } = this.props;
        const userNameText = userName ? userName : '';

        return (
            <View style={styles.userDataContainer}>
                <MediumBoldText style={styles.userDataText}>
                    {userNameText}
                </MediumBoldText>
            </View>
        );
    };

    _renderLeftContainer = () => {
        const { profilePic, onProfilePress, styles, name } = this.props;

        if (!isNull(profilePic)) {
            return (
                <TouchableOpacity
                    testID="HomeScreen__profileImage--button"
                    onPress={onProfilePress}
                    style={styles.leftContainer}>
                    <Avatar
                        small
                        source={profilePic}
                        style={styles.thumbnail}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                testID="HomeScreen__profileText--button"
                onPress={onProfilePress}
                style={styles.leftContainer}>
                <View style={styles.profileBackground}>
                    <Text style={styles.profileText}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                {this._renderLeftContainer()}
                <View style={styles.centerContainer}>
                    {this._renderUserData()}
                </View>
                <View style={styles.rightContainer}>
                    {this._renderSignInButton()}
                </View>
            </View>
        );
    }
}
export default withTranslation()(withTheme(Header, headerStyle));
