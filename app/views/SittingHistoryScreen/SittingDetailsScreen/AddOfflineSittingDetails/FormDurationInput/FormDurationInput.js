import React from 'react';
import { Input, View } from 'native-base';
import { Image } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { withTranslation } from 'react-i18next';
import { styles as formDurationInputStyles } from './FormDurationInput.styles';
import formDurationInputImages from './img';
import { Text } from 'app/views/shared/Text';
import { isUndefined } from 'lodash';
class FormDurationInput extends React.Component {
    _renderError = () => {
        const { styles, error } = this.props;

        if (!isUndefined(error)) {
            return <Text style={styles.error}>{error}</Text>;
        }
        return null;
    };
    _renderRightElement = () => {
        const { images, styles } = this.props;
        return (
            <Image
                style={styles.durationIcon}
                source={images.duration}
            />
        );
    };
    render() {
        const { t, styles, value } = this.props;
        return (
            <View style={styles.durationInputItem}>
                    <Input
                        placeholder={t('addOfflineSittingDetails:duration')}
                        value={value}
                        style={styles.durationInput}
                        variant="unstyled"
                        placeholderTextColor="#AFAFAF"
                        editable={false}
                        InputRightElement={this._renderRightElement()}
                    />
                    
                {this._renderError()}
            </View>
        );
    }
}
export default withTranslation()(
    withTheme(
        FormDurationInput,
        formDurationInputStyles,
        formDurationInputImages,
    ),
);
