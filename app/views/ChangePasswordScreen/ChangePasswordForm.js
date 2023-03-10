import React, { Component } from 'react';
import { View } from 'react-native';
import { withTranslation } from 'react-i18next';
import { Button, PasswordInput } from '../shared';
import { styles as changePasswordFormStyle } from './ChangePasswordScreen.styles';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Stack } from 'native-base';

class ChangePasswordForm extends Component {
    _renderSubmitButton = () => {
        const { t, handleSubmit, styles } = this.props;
        return (
            <Button
                rounded={true}
                onPress={handleSubmit}
                style={styles.updateButton}
                text={t('changePasswordScreen:updatePassword')}
                testID="changePasswordScreen__update--button"
            />
        );
    };

    render = () => {
        const {
            t,
            values,
            handleChange,
            handleSubmit,
            errors,
            styles,
        } = this.props;
        return (
            <View>
                <View style={styles.passwordCardBodyContainer}>
                    <Stack space={styles.stackSpace}>
                        <PasswordInput
                            placeholder={t(
                                'changePasswordScreen:currentPassword',
                            )}
                            value={values.currentPassword}
                            onChangeText={handleChange('currentPassword')}
                            itemStyle={styles.inputItem}
                            error={errors.currentPassword}
                        />
                        <PasswordInput
                            placeholder={t(
                                'changePasswordScreen:newPassword',
                            )}
                            value={values.newPassword}
                            onChangeText={handleChange('newPassword')}
                            itemStyle={styles.inputItem}
                            error={errors.newPassword}
                        />
                    </Stack>
                </View>
                {this._renderSubmitButton(handleSubmit)}
            </View>
        );
    };
}

export default withTranslation()(
    withTheme(ChangePasswordForm, changePasswordFormStyle),
);
