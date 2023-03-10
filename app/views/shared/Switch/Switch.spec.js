import React from 'react';
import Switch from './index';
import { find } from 'app/utils/TestUtils';
import PanResponder from 'react-native/Libraries/Interaction/PanResponder';
import { render, fireEvent } from 'TestUtils';

describe('SwitchContainer', () => {
    jest.useFakeTimers();

    const switchContainerID = 'switch-pan-gesture-container';
    const panResponderMock = jest
        .spyOn(PanResponder, 'create')
        .mockImplementation((value) => {
            return {
                panHandlers: value,
            };
        });
    const onValueChangeMock = jest.fn();

    const Component = (props) => {
        return render(<Switch {...props} />);
    };

    beforeEach(() => {
        panResponderMock.mockClear();
    });
    afterEach(() => {
        onValueChangeMock.mockClear();
    });

    const simulatePanEvent = (switchComponent, name, dx) => {
        fireEvent(
            switchComponent,
            name,
            {},
            {
                dx,
            },
        );
    };
    it('Should have a Switch Pan gesture Container component ', () => {
        const { container } = Component();
        expect(find(container, switchContainerID)).toBeDefined();
    });

    it('Should able to toggle the value, when user tap on switch', () => {
        const { container } = Component({
            disabled: false,
            onValueChange: onValueChangeMock,
        });
        const switchComponent = find(container, switchContainerID);

        fireEvent(switchComponent, 'onLayout', {
            nativeEvent: { layout: { width: 320, height: 40 } },
        });
        simulatePanEvent(
            switchComponent,
            'onStartShouldSetPanResponderCapture',
            1,
        );
        simulatePanEvent(switchComponent, 'onPanResponderEnd', 1);

        expect(onValueChangeMock).toBeCalledWith(true);
    });

    describe('#Disable Switch', () => {
        it('Should not able to toggle the value, when switch  is disabled state', () => {
            const { container } = Component({
                disabled: true,
                onValueChange: onValueChangeMock,
            });
            const switchComponent = find(container, switchContainerID);

            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });
            simulatePanEvent(
                switchComponent,
                'onStartShouldSetPanResponderCapture',
                1,
            );
            simulatePanEvent(
                switchComponent,
                'onPanResponderTerminationRequest',
            );

            simulatePanEvent(switchComponent, 'onPanResponderEnd', 1);

            expect(onValueChangeMock).not.toHaveBeenCalled();
        });
    });
    describe('#Switch touch interaction cancel', () => {
        it('Should not able to toggle the value, when user move has been terminate state', () => {
            const { container } = Component({
                disabled: false,
                onValueChange: onValueChangeMock,
            });
            const switchComponent = find(container, switchContainerID);
            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });
            simulatePanEvent(
                switchComponent,
                'onStartShouldSetPanResponderCapture',
                1,
            );
            fireEvent(switchComponent, 'onPanResponderGrant');
            simulatePanEvent(switchComponent, 'onPanResponderMove', 120);
            fireEvent(switchComponent, 'onPanResponderTerminate');

            expect(onValueChangeMock).not.toHaveBeenCalled();
        });

        it('Should not able to toggle the value, when user move has been rejected state', () => {
            const { container } = Component({
                value: true,
                disabled: false,
                onValueChange: onValueChangeMock,
            });
            const switchComponent = find(container, switchContainerID);
            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });

            simulatePanEvent(
                switchComponent,
                'StartShouldSetPanResponderCapture',
                1,
            );
            fireEvent(switchComponent, 'onPanResponderGrant');
            simulatePanEvent(switchComponent, 'PanResponderMove', 120);
            fireEvent(switchComponent, 'onPanResponderReject');
            expect(onValueChangeMock).not.toHaveBeenCalled();
        });
    });
    describe('#Switch touch interaction completed', () => {
        it('Should not able to toggle value to false, when switch current value is false', () => {
            const { container } = Component({
                value: false,
                disabled: false,
                onValueChange: onValueChangeMock,
            });
            const switchComponent = find(container, switchContainerID);

            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });

            simulatePanEvent(
                switchComponent,
                'onStartShouldSetPanResponderCapture',
                1,
            );
            fireEvent(switchComponent, 'onPanResponderGrant');

            simulatePanEvent(switchComponent, 'onPanResponderMove', -10);
            simulatePanEvent(switchComponent, 'onPanResponderMove', 120);

            simulatePanEvent(switchComponent, 'onPanResponderEnd', 120);

            simulatePanEvent(switchComponent, 'onPanResponderRelease', 120);

            expect(onValueChangeMock).not.toHaveBeenCalled();
        });
        it('Should not able to toggle value to true, when switch current value is true', () => {
            const { container } = Component({
                value: true,
                disabled: false,
                onValueChange: onValueChangeMock,
            });
            const switchComponent = find(container, switchContainerID);
            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });
            simulatePanEvent(
                switchComponent,
                'onStartShouldSetPanResponderCapture',
                1,
            );
            fireEvent(switchComponent, 'onMoveShouldSetPanResponder');
            fireEvent(switchComponent, 'onPanResponderGrant');
            simulatePanEvent(switchComponent, 'onPanResponderMove', 80);
            simulatePanEvent(switchComponent, 'onPanResponderMove', 120);

            simulatePanEvent(switchComponent, 'onPanResponderEnd', 220);

            simulatePanEvent(switchComponent, 'onPanResponderRelease', 220);

            expect(onValueChangeMock).not.toHaveBeenCalled();
        });
        it('Should able to change the value to false, when switch current value is true', () => {
            const { container, update } = Component({
                value: true,
                disabled: false,
                onValueChange: onValueChangeMock,
            });

            const switchComponent = find(container, switchContainerID);
            fireEvent(switchComponent, 'onLayout', {
                nativeEvent: { layout: { width: 320, height: 40 } },
            });

            update(<Switch value={false} onValueChange={onValueChangeMock} />);

            simulatePanEvent(
                switchComponent,
                'onStartShouldSetPanResponderCapture',
                1,
            );

            fireEvent(switchComponent, 'onPanResponderGrant');
            simulatePanEvent(switchComponent, 'onPanResponderMove', 20);
            simulatePanEvent(switchComponent, 'onPanResponderMove', 80);
            simulatePanEvent(switchComponent, 'onPanResponderMove', 230);

            simulatePanEvent(switchComponent, 'onPanResponderEnd', 230);

            simulatePanEvent(switchComponent, 'onPanResponderRelease', 230);

            expect(onValueChangeMock).toBeCalledWith(true);
        });
    });
});
