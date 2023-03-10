import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { isEqual } from 'lodash';

import { styles } from './Switch.styles';

class Switch extends Component {
    constructor(props) {
        super(props);
        this._animatedValueX = 0;
    }
    state = {
        positionX: new Animated.Value(0),
        layoutSize: {},
    };
    _getTrackWidth = () => {
        return this.state.layoutSize.width - this.props.thumbSize;
    };
    _shouldAllowTouch = () => !this.props.disabled;

    _getValueInRange = (min, max, value) => {
        if (value < min) {
            return min;
        }
        return value > max ? max : value;
    };

    _updateSwitch = () => {
        const position = this.props.value ? this._getTrackWidth() : 0;
        this._doAnimation(position);
    };
    _doAnimation = (position, duration = 300) => {
        Animated.timing(this.state.positionX, {
            useNativeDriver: true,
            toValue: position,
            duration,
        }).start();
        this._animatedValueX = position;
    };

    componentDidUpdate = (prevProps) => {
        if (!isEqual(this.props.value, prevProps.value)) {
            this._updateSwitch();
        }
    };

    UNSAFE_componentWillMount = () => {
        this._animatedValueX = 0;

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._shouldAllowTouch,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                this.initialTouchPoint = gestureState.dx;
                return !this.props.disabled;
            },
            onMoveShouldSetPanResponder: this._shouldAllowTouch,
            onMoveShouldSetPanResponderCapture: this._shouldAllowTouch,
            onPanResponderTerminationRequest: () => true,
            onPanResponderGrant: (e, gestureState) => {
                this.touchStart = this._animatedValueX;
                this._doAnimation(this._animatedValueX);
            },
            onPanResponderMove: (evt, gestureState) => {
                const positionX = this.touchStart + gestureState.dx;
                const maxWidth = this._getTrackWidth();
                const locationX = this._getValueInRange(0, maxWidth, positionX);

                this._doAnimation(locationX, 0);
            },
            onPanResponderEnd: (evt, gestureState) => {
                if (isEqual(this.initialTouchPoint, gestureState.dx)) {
                    this._handlePress();
                }
            },
            onPanResponderTerminate: () => {
                this._updateSwitch();
            },
            onPanResponderReject: () => {
                this._updateSwitch();
            },
            onPanResponderRelease: () => {
                const maxWidth = this._getTrackWidth();
                const midX = maxWidth / 2;
                const isOn = midX < this._animatedValueX;

                if (isEqual(this.props.value, isOn)) {
                    this._updateSwitch();
                    return;
                }
                this._handleValueChange(isOn);
            },
        });
    };

    _handlePress = () => {
        const { value } = this.props;
        this._handleValueChange(!value);
    };

    _handleValueChange = (value) => {
        const { disabled, onValueChange } = this.props;
        if (!disabled) {
            onValueChange(value);
        }
    };

    _handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        this.setState(
            {
                layoutSize: { width, height },
            },
            () => this._updateSwitch(),
        );
    };

    _getThumbStyle = () => {
        const { value, circleInActiveColor, circleActiveColor, thumbSize } =
            this.props;
        const backgroundColor = value ? circleActiveColor : circleInActiveColor;
        return [
            styles.switchInnerCircle,
            {
                backgroundColor,
                width: thumbSize,
                height: thumbSize,
                transform: [
                    {
                        translateX: this.state.positionX,
                    },
                ],
            },
        ];
    };

    _getTrackStyle = () => {
        const { value, backgroundInActiveColor, backgroundActiveColor } =
            this.props;
        const backgroundColor = value
            ? backgroundActiveColor
            : backgroundInActiveColor;
        return [
            styles.track,
            {
                backgroundColor,
            },
        ];
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={this._getTrackStyle()} />
                <Animated.View
                    style={styles.container}
                    {...this._panResponder.panHandlers}
                    testID="switch-pan-gesture-container"
                    onLayout={this._handleLayout}>
                    <Animated.View style={this._getThumbStyle()} />
                </Animated.View>
            </View>
        );
    }
}
Switch.defaultProps = {
    thumbSize: 22,
};
export default Switch;
