import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { styles as listScreenStyles } from './ListScreen.styles';
import { FlatList, Image } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import ListScreenItem from './ListScreenItem';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { View, Container } from 'native-base';
import { MediumBoldText } from '../shared';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import listScreenImages from './img';

class ListScreen extends Component {
    _handleListItemSelected = (item, index) => {
        const { onItemSelect } = this.props;
        onItemSelect(item, index);
    };

    _renderListItem = ({ index, item }) => {
        const { title, value } = item;
        return (
            <ListScreenItem
                testID="ListScreen--listScreenItem"
                index={index}
                title={title}
                value={value}
                item={item}
                handleListItemSelected={this._handleListItemSelected}
            />
        );
    };

    _handleKeyExtractor = (item, index) => index.toString();

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _renderContent = () => {
        const { t, data, styles, images } = this.props;
        if (data.length > 0) {
            return (
                <FlatList
                    showsVerticalScrollIndicator={true}
                    data={data}
                    renderItem={this._renderListItem}
                    keyExtractor={this._handleKeyExtractor}
                />
            );
        } else {
            return (
                <Container style={styles.container}>
                    <View style={styles.centerAlign}>
                        <MediumBoldText style={styles.centerText}>
                            {t('donationFormScreen:statesNotAvailable')}
                        </MediumBoldText>
                        <Image
                            testID="ListScreen__image--placeImage"
                            source={images.place}
                            style={styles.placeImage}
                        />
                    </View>
                </Container>
            );
        }
    };

    render() {
        const { listHeadingText } = this.props;

        return (
            <ScreenContainer noBackground={true}>
                <OptionsScreenHeader
                    title={listHeadingText}
                    onBackPress={this._handleBackPress}
                />
                {this._renderContent()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(ListScreen, listScreenStyles, listScreenImages),
);
