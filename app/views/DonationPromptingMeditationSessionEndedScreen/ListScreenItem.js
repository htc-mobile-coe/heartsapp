import React, { useCallback } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as ListScreenStyles } from './ListScreen.styles';
import { TouchableOpacity } from 'react-native';
import { Text, MediumBoldText } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

const ListScreenItem = ({
    title,
    value,
    item,
    index,
    handleListItemSelected,
    styles,
}) => {
    const _handleOnPress = useCallback(() => {
        handleListItemSelected(item, index);
    }, [handleListItemSelected, index, item]);

    return (
        <View>
            <TouchableOpacity onPress={_handleOnPress}>
                <View style={styles.listItemContainer}>
                    <View style={styles.itemName}>
                        <MediumBoldText>{title}</MediumBoldText>
                    </View>
                    <View style={styles.itemRightContainer}>
                        <Text style={styles.itemCodeText}>{value}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default withTranslation()(withTheme(ListScreenItem, ListScreenStyles));
