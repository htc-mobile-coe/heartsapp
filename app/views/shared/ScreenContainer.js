import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
} from 'react-native';
import OfflineNotice from './OfflineNotice';
import AppBusyOverlay from './AppBusyOverlay';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import screenContainerImages from './Images';

const style = props =>
    StyleSheet.create({
        main: {
            flex: 1,
            backgroundColor: props.primaryBackground,
        },

        container: { flex: 1 },
    });

class ScreenContainer extends React.Component {
    _renderWithBackgroundGradient = () => {
        const { styles, images } = this.props;
        return (
            <ImageBackground
                source={images.appContainerBackground}
                style={styles.container}>
                {this._renderChildren()}
            </ImageBackground>
        );
    };

    _renderChildren = () => {
        const {
            children,
            enableScroll,
            contentContainerStyle,
            scrollStyle,
            styles,
        } = this.props;
        const RenderComponent = enableScroll ? ScrollView : View;
        const containerStyle = enableScroll ? scrollStyle : styles.container;
        return (
            <RenderComponent
                contentContainerStyle={contentContainerStyle}
                style={containerStyle}
                keyboardShouldPersistTaps="handled">
                <OfflineNotice />
                {children}
            </RenderComponent>
        );
    };

    render() {
        const {
            noBackground,
            styles,
            containerStyle,
            spinnerColor,
            enableSafeArea,
        } = this.props;

        const _render = noBackground
            ? this._renderChildren
            : this._renderWithBackgroundGradient;

        const BaseComponent = enableSafeArea ? SafeAreaView : View;
        return (
            <BaseComponent style={[styles.main, containerStyle]}>
                {_render()}
                <AppBusyOverlay spinnerColor={spinnerColor} />
            </BaseComponent>
        );
    }
}

ScreenContainer.defaultProps = {
    children: null,
    scrollStyle: {},
    containerStyle: {},
    enableSafeArea: true,
    enableScroll: true,
};

export default withTheme(ScreenContainer, style, screenContainerImages);
