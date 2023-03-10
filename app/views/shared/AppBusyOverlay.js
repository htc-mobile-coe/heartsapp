import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { operations } from '../../state';
import { connect } from 'react-redux';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import FastImage from 'react-native-fast-image';
import AppBusyOverlayImages from './Images';
const style = props =>
    StyleSheet.create({
        loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
        image: {
            width: '100%',
            aspectRatio: 4,
            resizeMode: 'contain',
        },
    });

export class AppBusyOverlay extends React.Component {
    render() {
        const { show, styles, images } = this.props;

        if (!show) {
            return null;
        }
        return (
            <View style={styles.loading}>
                <FastImage
                    source={images.loader}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    }
}

export const mapStateToProps = state => {
    return {
        show: state.appBusyStatus.busy,
    };
};

const mapDispatchToProps = {
    ...operations.appBusyStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTheme(AppBusyOverlay, style, AppBusyOverlayImages));
