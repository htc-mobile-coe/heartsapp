import React from 'react';
import DaysInputSpinner from './DaysInputSpinner';
import { Input } from '../shared';
import { TouchableOpacity } from 'react-native';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';

describe('DaysInputSpinner', () => {
    const increaseCountButton = 'DaysInputSpinner__increaseCount--button';
    const decreaseCountButton = 'DaysInputSpinner__decreaseCount--button';
    const valueChangeInput = 'DaysInputSpinner__valueChange--input';
    let isAllowedToIncreaseCountMock;
    const onDaysCountChangeMock = jest.fn();
    const Component = (props) => render(<DaysInputSpinner {...props} />);
    let setFieldValueMock;
    const prepare = value => {
        isAllowedToIncreaseCountMock = jest
            .fn()
            .mockImplementation(() => value);
    };

    beforeEach(() => {
        setFieldValueMock = jest.fn();
    });
    afterEach(() => {
        onDaysCountChangeMock.mockClear();
        if (setFieldValueMock) {
            setFieldValueMock.mockClear();
            setFieldValueMock = undefined;
        }
        if (isAllowedToIncreaseCountMock) {
            isAllowedToIncreaseCountMock.mockClear();
            isAllowedToIncreaseCountMock = undefined;
        }
    });
    it('Should have a DaysInputSpinner component', () => {
        const { container } = Component({
            values: { additionalCount: 1, maximumCountAllowed: 9 },
        });
        expect(container).toBeDefined();
    });

    it('Should have two TouchableOpacity component for both increase and decrease count', () => {
        const { container } = Component({
            values: { additionalCount: 1, maximumCountAllowed: 9 },
            disabled: true,
        });
        const style = {
            width: 40,
            height: 40,
            backgroundColor: '#E1E1E1',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderRadius: 5,
        }
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
        expect(find(container, increaseCountButton)).toHaveProp('style', style);
    });

    it('Should have Input component for change the count', () => {
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
            }
        );
        expect(container.findByType(Input)).toBeDefined();
    });

    it('Should fire increase count event when user click on increase count button', () => {
        prepare(2);
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                isAllowedToIncreaseCount: isAllowedToIncreaseCountMock,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        expect(find(container, increaseCountButton)).toBeDefined();
        fireEvent(find(container, increaseCountButton), 'Press');
        expect(setFieldValueMock.mock.calls[0]).toEqual([
            'additionalCount',
            '2',
        ]);
        expect(onDaysCountChangeMock).toHaveBeenCalledWith(2);
    });

    it('Should not fire increase count event when count reaches the maximum count', () => {
        prepare(9);
        const { container } = Component(
            {
                values: { additionalCount: 9, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                isAllowedToIncreaseCount: isAllowedToIncreaseCountMock,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        expect(find(container, increaseCountButton)).toBeDefined();
        fireEvent(find(container, increaseCountButton), 'Press');
        expect(setFieldValueMock).not.toHaveBeenCalled();
        expect(onDaysCountChangeMock).not.toHaveBeenCalled();
    });

    it('Should fire decrease count event when user click on decrease count button', () => {
        const { container } = Component(
            {
                values: { additionalCount: 2, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        fireEvent(find(container, decreaseCountButton), 'Press');
        expect(setFieldValueMock.mock.calls[0]).toEqual([
            'additionalCount',
            '1',
        ]);
        expect(onDaysCountChangeMock).toHaveBeenCalledWith(1);
    });

    it('Should not fire decrease count event when count reaches the minimum count', () => {
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        fireEvent(find(container, decreaseCountButton), 'Press');
        expect(setFieldValueMock).not.toHaveBeenCalled();
        expect(onDaysCountChangeMock).not.toHaveBeenCalled();
    });

    it('Should fire value change event when user backpress the value in input field', () => {
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                isAllowedToIncreaseCount: true,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        fireEvent(find(container, valueChangeInput), 'ChangeText');
        expect(setFieldValueMock.mock.calls[0]).toEqual([
            'additionalCount',
            '1',
        ]);
        expect(onDaysCountChangeMock).toHaveBeenCalledWith(1);
    });

    it('Should fire value change event when user change the value in input field', () => {
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                isAllowedToIncreaseCount: true,
                onDaysCountChange: onDaysCountChangeMock,
            }
        );
        fireEvent(find(container, valueChangeInput), 'ChangeText', '2');
        expect(setFieldValueMock.mock.calls[0]).toEqual([
            'additionalCount',
            '2',
        ]);
        expect(onDaysCountChangeMock).toHaveBeenCalledWith(2);
    });

    it('Should not fire value change event when user change the count beyond maximum count ', () => {
        prepare(10);
        const { container } = Component(
            {
                values: { additionalCount: 1, maximumCountAllowed: 9 },
                setFieldValue: setFieldValueMock,
                isAllowedToIncreaseCount: isAllowedToIncreaseCountMock,
            }
        );
        fireEvent(find(container, valueChangeInput), 'ChangeText', '10');
        expect(setFieldValueMock).not.toHaveBeenCalled();
    });
});
