import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { Image } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SeekerBarcodeScannedResultStyle } from './SeekerBarcodeScannedResult.styles';
import SeekerBarcodeScannedResultImages from './img';
import { isEmpty, isNull } from 'lodash';

class SeekerBarcodeScannedItem extends React.Component {
    _getUserProfilePicture = () => {
        const { item, images } = this.props;
        const { userImage } = item;

        if (!isEmpty(userImage) && !isNull(userImage)) {
            return {
                uri: userImage,
            };
        }
        return images.avatar;
    };

    render() {
        const { item, images, styles } = this.props;
        const { name, id } = item;

        return (
            <View style={styles.itemContainer} key={id}>
                <View style={styles.itemUserImageView}>
                    <Image
                        style={styles.itemUserImage}
                        source={this._getUserProfilePicture()}
                        testID="seekerBarcodeScannedItem__user--Image"
                    />
                </View>
                <View>
                    <View style={styles.itemRow}>
                        <Image
                            style={styles.itemIcon}
                            source={images.person}
                            testID="seekerBarcodeScannedItem__person--Image"
                        />
                        <MediumBoldText>{name}</MediumBoldText>
                    </View>
                    <View style={styles.itemRow}>
                        <Image
                            style={styles.itemIcon}
                            source={images.idCard}
                            testID="seekerBarcodeScannedItem__idCard--Image"
                        />
                        <Text>{id}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        SeekerBarcodeScannedItem,
        SeekerBarcodeScannedResultStyle,
        SeekerBarcodeScannedResultImages,
    ),
);
