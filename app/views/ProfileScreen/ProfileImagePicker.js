import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { styles as ProfileImagePickerStyle } from './ProfileImagePicker.styles';
import { TouchableOpacity, Image } from 'react-native';
import { View } from 'native-base';
import { MediumBoldText } from '../shared/Text';
import ProfilePickerImage from './img';

class ProfileImagePicker extends Component {
    render() {
        const {
            t,
            styles,
            images,
            onDeletePhotoButtonPress,
            onTakePhotoButtonPress,
            onChoosePhotoButtonPress,
            onCancelButtonPress,
        } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onDeletePhotoButtonPress}
                    testID="ProfileImagePicker__deletePhoto--touchableOpacity">
                    <Image
                        source={images.deletePhotoImage}
                        style={styles.image}
                    />
                    <MediumBoldText style={styles.buttonText}>
                        {t('profileImagePicker:deletePhoto')}
                    </MediumBoldText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onTakePhotoButtonPress}
                    testID="ProfileImagePicker__takePhoto--touchableOpacity">
                    <Image
                        source={images.takePhotoImage}
                        style={styles.image}
                    />
                    <MediumBoldText style={styles.buttonText}>
                        {t('profileImagePicker:takePhoto')}
                    </MediumBoldText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onChoosePhotoButtonPress}
                    testID="ProfileImagePicker__choosePhoto--touchableOpacity">
                    <Image
                        source={images.choosePhotoImage}
                        style={styles.image}
                    />
                    <MediumBoldText style={styles.buttonText}>
                        {t('profileImagePicker:choosePhoto')}
                    </MediumBoldText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButtonContainer}
                    onPress={onCancelButtonPress}
                    testID="ProfileImagePicker__cancel--touchableOpacity">
                    <MediumBoldText style={styles.cancelButtonText}>
                        {t('profileImagePicker:cancel')}
                    </MediumBoldText>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(ProfileImagePicker, ProfileImagePickerStyle, ProfilePickerImage),
);
