import React, { Component } from 'react';
import Draggable from 'react-native-draggable';
import { styles } from './HeartInTuneFloatingButton.styles';
import { Image } from 'react-native';
export default class HeartInTuneFloatingButton extends Component {
    render() {
        const {
            imageSource,
            onSelectIcon,
            floatingButtonShouldRevertToDefaultPosition,
            onDrag,
            onDragRelease
        } = this.props;
        return (
            <Draggable
                x={styles.positionX}
                y={styles.positionY}
                onShortPressRelease={onSelectIcon}
                renderSize={styles.buttonSize}
                shouldReverse={floatingButtonShouldRevertToDefaultPosition}
                minX={styles.minWidth}
                maxX={styles.maxWidth}
                minY={styles.minHeight}
                maxY={styles.maxHeight}
                onPressIn={onDrag}
                onDragRelease={onDragRelease}
            >
                <Image style={styles.draggableIcon} source={imageSource} />
            </Draggable>
        );
    }
}
