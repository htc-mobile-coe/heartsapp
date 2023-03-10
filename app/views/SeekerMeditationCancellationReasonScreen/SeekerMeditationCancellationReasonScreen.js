import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as seekerMeditationCancellationReasonStyle } from './SeekerMeditationCancellationReasonScreen.styles';
import Radio from '../shared/Radio';
import { withTranslation } from 'react-i18next';
import { map, isEqual, get } from 'lodash';
import { MediumBoldText } from '../shared/Text';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Button } from '../shared';

class seekerMeditationCancellationReasonScreen extends Component {
    _renderRadioButtons = () => {
        const { radioButtonOptions } = this.props;
        return map(radioButtonOptions, this._renderRadio);
    };

    _renderRadio = (item, index) => {
        const {
            onCancellationReasonRadioPress,
            sessionCancellationReason,
            theme,
            styles,
        } = this.props;
        const sessionCancellationReasonId = get(
            sessionCancellationReason,
            'id',
        );
        return (
            <Radio
                style={styles.radio}
                onPress={onCancellationReasonRadioPress}
                textStyle={styles.radioText}
                color={theme.brandPrimary}
                selectedColor={theme.brandPrimary}
                text={item.label}
                data={item}
                selected={isEqual(sessionCancellationReasonId, item.id)}
                key={index}
            />
        );
    };

    render() {
        const {
            t,
            styles,
            onCancellationReasonSubmitPress,
            disableSubmitButton,
        } = this.props;
        const submitButtonStyle = disableSubmitButton
            ? styles.disableSubmitButton
            : styles.submitButton;
        return (
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <MediumBoldText testID="seekerMeditationCancelScreen__MediumBoldText">
                        {t('seekerMeditationCancellationReasonScreen:title')}
                    </MediumBoldText>
                </View>
                <View style={styles.radiosContainer}>
                    {this._renderRadioButtons()}
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        rounded={true}
                        disabled={disableSubmitButton}
                        style={submitButtonStyle}
                        onPress={onCancellationReasonSubmitPress}
                        text={t(
                            'seekerMeditationCancellationReasonScreen:submit',
                        )}
                        testID="seekerMeditationCancelScreen__submit--button"
                    />
                </View>
            </View>
        );
    }
}
export default withTranslation()(
    withTheme(
        seekerMeditationCancellationReasonScreen,
        seekerMeditationCancellationReasonStyle,
    ),
);
