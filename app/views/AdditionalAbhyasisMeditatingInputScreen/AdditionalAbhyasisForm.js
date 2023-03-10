import React, { Component, Fragment } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { styles as additionalAbhyasisMeditatingInputStyle } from './AdditionalAbhyasisMeditatingInputScreen.styles';
import { Text, Button, Input, BolderText } from '../shared';
import { isNil, isEmpty } from 'lodash';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Add as AddIcon, Remove as RemoveIcon } from '../shared/Icon';

class AdditionalAbhyasisForm extends Component {
    _renderErrorMessage = errors => {
        const { additionalAbhyasisCount, styles } = errors;

        if (!isNil(additionalAbhyasisCount)) {
            return (
                <Text
                    testID="additionalAbhyasisForm__errorMessage--text"
                    style={styles.validationErrorText}>
                    {additionalAbhyasisCount}
                </Text>
            );
        }

        return null;
    };
    _renderDNDInstruction = () => {
        const { t, styles, showDNDInstruction } = this.props;
        if (!showDNDInstruction) {
            return;
        }
        return (
            <View style={styles.dndInstructionContainer}>
                <Text style={styles.dndInstructionTitleText}>
                    {t(
                        'additionalAbhyasisMeditatingInputScreen:turnOnPhoneDNDMode',
                    )}
                </Text>
                <Text style={styles.dndInstructionText}>
                    <Text style={styles.dndInstructionText}>
                        {t(
                            'additionalAbhyasisMeditatingInputScreen:dndModeStayOnThisApp',
                        )}
                    </Text>
                    <Text style={styles.dndInstructionText}>
                        {' '}
                        {t('additionalAbhyasisMeditatingInputScreen:and')}{' '}
                    </Text>
                    <BolderText style={styles.dndInstructionHighlightedText}>
                        {t('additionalAbhyasisMeditatingInputScreen:dontLock')}
                    </BolderText>{' '}
                    <Text style={styles.dndInstructionText}>
                        {t(
                            'additionalAbhyasisMeditatingInputScreen:yourDevice',
                        )}
                    </Text>
                </Text>
            </View>
        );
    };
    isAllowedToIncreaseAbhyasisCount = abhyasisCount => {
        const { values } = this.props;
        return (
            parseInt(abhyasisCount, 0) <=
            parseInt(values.maximumAbhyasisAllowed, 0)
        );
    };

    _decreaseAbhyasiCount = () => {
        const { values, setFieldValue } = this.props;
        if (parseInt(values.additionalAbhyasisCount, 0) > 0) {
            setFieldValue(
                'additionalAbhyasisCount',
                String(parseInt(values.additionalAbhyasisCount, 0) - 1),
            );
        }
    };

    _increaseAbhyasiCount = () => {
        const { values, setFieldValue } = this.props;
        if (
            this.isAllowedToIncreaseAbhyasisCount(
                parseInt(values.additionalAbhyasisCount, 0) + 1,
            )
        ) {
            setFieldValue(
                'additionalAbhyasisCount',
                String(parseInt(values.additionalAbhyasisCount, 0) + 1),
            );
        }
    };

    _valueChanged = text => {
        const { setFieldValue } = this.props;
        const updatedAbhyasiCount = isEmpty(text)
            ? '0'
            : text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '');
        if (this.isAllowedToIncreaseAbhyasisCount(updatedAbhyasiCount)) {
            setFieldValue(
                'additionalAbhyasisCount',
                String(parseInt(updatedAbhyasiCount, 0)),
            );
        }
    };

    render() {
        const {
            t,
            values,
            handleSubmit,
            errors,
            styles,
            showDNDInstruction,
        } = this.props;
        const buttonStyle = showDNDInstruction
            ? styles.buttonLessTopMarginContainer
            : styles.buttonContainer;
        return (
            <Fragment>
                <View style={styles.modalContentView}>
                    <View style={styles.centerContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {t(
                                    'additionalAbhyasisMeditatingInputScreen:numberOfAbhyasis',
                                )}
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                onPress={this._decreaseAbhyasiCount}
                                testID="additionalAbhyasisForm__decreaseCount--button">
                                <RemoveIcon style={styles.additionalIcons} />
                            </TouchableOpacity>
                            <Input
                                style={styles.input}
                                itemStyle={styles.inputBackground}
                                value={values.additionalAbhyasisCount}
                                onChangeText={this._valueChanged}
                                keyboardType={'number-pad'}
                            />
                            <TouchableOpacity
                                onPress={this._increaseAbhyasiCount}
                                testID="additionalAbhyasisForm__increaseCount--button">
                                <AddIcon style={styles.additionalIcons} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this._renderErrorMessage(errors)}
                </View>
                {this._renderDNDInstruction()}
                <View style={buttonStyle}>
                    <Button
                        rounded={true}
                        text={t(
                            'additionalAbhyasisMeditatingInputScreen:connectWithTrainer',
                        )}
                        onPress={handleSubmit}
                        style={styles.button}
                    />
                </View>
            </Fragment>
        );
    }
}

export default withTranslation()(
    withTheme(AdditionalAbhyasisForm, additionalAbhyasisMeditatingInputStyle),
);
