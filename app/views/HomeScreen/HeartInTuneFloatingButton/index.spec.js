import React from 'react';
import { render, fireEvent } from 'app/utils/TestUtils';
import HeartInTuneFloatingButton from './HeartInTuneFloatingButton';
import Draggable from 'react-native-draggable';
import { styles } from './HeartInTuneFloatingButton.styles';
import { Image } from 'react-native';

describe('HeartInTuneFloatingButton', () => {
    const Component = (props) => render(<HeartInTuneFloatingButton {...props} />);

    it('Should have a Draggable component', () => {
        const { container } = Component({
            onSelectIcon: jest.fn(),
            floatingButtonShouldRevertToDefaultPosition: true,
        });
        expect(container.findAllByType(Draggable)).toHaveLength(1);
        expect(container.findByType(Draggable)).toHaveProp('x', styles.positionX)
        expect(container.findByType(Draggable)).toHaveProp('y', styles.positionY)
        expect(container.findByType(Draggable)).toHaveProp('renderSize', styles.buttonSize)
        expect(container.findByType(Draggable)).toHaveProp('maxX', styles.maxWidth)
        expect(container.findByType(Draggable)).toHaveProp('minY', styles.minHeight)
        expect(container.findByType(Draggable)).toHaveProp('minX', styles.minWidth)
        expect(container.findByType(Draggable)).toHaveProp('maxY', styles.maxHeight)
        expect(container.findByType(Draggable)).toHaveProp('shouldReverse', true)
    });

    it('Should have a Image component', () => {
        const { container } = Component();
        expect(container.findAllByType(Image)).toHaveLength(1);
    });
    it('Should call onSelectIcon for Draggable component ', () => {
        const onSelectIconMock = jest.fn();
        const { container } = Component({
            onSelectIcon: onSelectIconMock,
        });
        expect(container.findAllByType(Draggable)).toHaveLength(1);
        fireEvent(container.findByType(Draggable), 'ShortPressRelease');
        expect(onSelectIconMock).toHaveBeenCalled();
    });
    it('Should fire onDrag event, when floating button is dragged ', () => {
        const onDragMock = jest.fn();
        const { container } = Component({
            onDrag: onDragMock,
        });
        expect(container.findAllByType(Draggable)).toHaveLength(1);
        fireEvent(container.findByType(Draggable), 'onPressIn');
        expect(onDragMock).toHaveBeenCalled();
    });
    it('Should fire onDragRelease event, when floating button dragging is released ', () => {
        const onDragReleaseMock = jest.fn();
        const { container } = Component({
            onDragRelease: onDragReleaseMock,
        });
        expect(container.findAllByType(Draggable)).toHaveLength(1);
        fireEvent(container.findByType(Draggable), 'onDragRelease');
        expect(onDragReleaseMock).toHaveBeenCalled();
    });
});
