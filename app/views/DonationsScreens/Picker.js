import React, { Component } from 'react';
import { TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import ListScreen from '../DonationPromptingMeditationSessionEndedScreen/ListScreen';
import { Text } from '../shared';
import { ArrowDown } from '../shared/Icon';
import { isNull, isUndefined } from 'lodash';
import { ActivityIndicator } from 'react-native';

class Picker extends Component {
    _handleListItemSelected = item => {
        const { onDismissPicker, onPickerItemSelected } = this.props;
        if (!isUndefined(onPickerItemSelected)) {
            onPickerItemSelected(item);
        }
        onDismissPicker();
    };

    _renderActivityIndicator = () => {
        const { onDismissPicker, show } = this.props;
        return (
            <Modal visible={show} onRequestClose={onDismissPicker}>
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </Modal>
        );
    };

    _renderListScreen = () => {
        const { items, heading, onDismissPicker, show } = this.props;
        if (isNull(items)) {
            return this._renderActivityIndicator();
        }
        return (
            <Modal visible={show} onRequestClose={onDismissPicker}>
                <ListScreen
                    listHeadingText={heading}
                    data={items}
                    onItemSelect={this._handleListItemSelected}
                    onBackPress={onDismissPicker}
                />
            </Modal>
        );
    };

    render() {
        const {
            onOpenPicker,
            placeholder,
            selectedItem,
            getDisplayText,
            disableClick,
        } = this.props;
        const text = getDisplayText(selectedItem) ?? placeholder;
        return (
            <View>
                <TouchableOpacity
                    style={styles.container}
                    onPress={onOpenPicker}
                    disabled={disableClick}>
                    <Text>{text}</Text>
                    <ArrowDown />
                </TouchableOpacity>
                {this._renderListScreen()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    activityIndicatorContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});

Picker.defaultProps = {
    show: false,
};
export default Picker;
