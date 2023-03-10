import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { Image } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SelectedSeekersStyle } from './SelectedSeekers.styles';
import SelectedSeekersImages from './img';

class SelectedSeekersItem extends React.Component {
    _renderItemRow = (imageSource, value) => {
        const { styles } = this.props;

        return (
            <View style={styles.itemRow}>
                <Image
                    style={styles.itemIcon}
                    source={imageSource}
                    testID="selectedSeekersItem__itemRow--Image"
                />
                <Text>{value}</Text>
            </View>
        );
    };

    render() {
        const { item, key, images, styles } = this.props;
        const { name, seekerId, phoneNo, email } = item;

        return (
            <View style={styles.itemContainer} key={key}>
                <View>
                    <View style={styles.itemRow}>
                        <Image
                            style={styles.itemIcon}
                            source={images.person}
                            testID="selectedSeekersItem__person--Image"
                        />
                        <MediumBoldText>{name}</MediumBoldText>
                    </View>
                    {this._renderItemRow(images.idCard, seekerId)}
                    {this._renderItemRow(images.phone, phoneNo)}
                    {this._renderItemRow(images.mail, email)}
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(SelectedSeekersItem, SelectedSeekersStyle, SelectedSeekersImages),
);
