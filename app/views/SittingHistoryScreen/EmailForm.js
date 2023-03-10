import React, { Component, Fragment } from 'react';
import { styles as emailFormStyles } from './ShareHistoryPopup.styles';
import { View } from 'native-base';
import { Button, Input } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import emailFormSImages from './img';
import { ActivityIndicator } from 'react-native';

class EmailForm extends Component {
    _renderButton = () => {
        const { t, handleSubmit, showShareHisoryLoader, styles } = this.props;

        if (showShareHisoryLoader) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            return (
                <Button
                    rounded={true}
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    text={t('sharePreceptorHistoryPopup:send')}
                    testID="shareHistoryPoup__send--button"
                />
            );
        }
    };
    render() {
        const { t, email, handleChange, errors, styles } = this.props;

        return (
            <View style={styles.emailContainer}>
                <Fragment>
                    <Input
                        value={email}
                        placeholder={t(
                            'sharePreceptorHistoryPopup:placeHolder',
                        )}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        onChangeText={handleChange('email')}
                        error={errors.email}
                        errorStyle={styles.errorStyle}
                    />
                    {this._renderButton()}
                </Fragment>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(EmailForm, emailFormStyles, emailFormSImages),
);
