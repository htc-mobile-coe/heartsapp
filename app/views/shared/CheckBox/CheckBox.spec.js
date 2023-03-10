import React from 'react';
import CheckBoxComponent from './index';
import { render, fireEvent } from 'TestUtils';
import { Text } from 'native-base';
import CheckBox from '@react-native-community/checkbox';

describe('CheckBox ', () => {
    const Component = (props) => <CheckBoxComponent {...props} />;
    it('Should exist', () => {
        const { container } = render(Component());
        expect(container).toBeDefined();
    });

    it('Should have checkbox and text component', () => {
        const { container } = render(
            Component({ text: 'Select Gender', checked: true }),
        );

        expect(container.findByType(Text)).toBeDefined();
        expect(container.findAllByType(CheckBox)).toBeDefined();
    });

    it('Should able to toggle the checkbox to true, when checkbox value is false', () => {
        const onPressMock = jest.fn();
        const { rerender, container } = render(
            Component({
                text: 'Select Gender',
                checked: false,
                data: true,
                onPress: onPressMock,
            }),
        );

        fireEvent(container.findByType(CheckBox), 'onChange');
        expect(onPressMock).toBeCalledWith(true);

        rerender(
            Component({
                text: 'Select Gender',
                checked: true,
                data: true,
            }),
        );
        expect(container.findByType(CheckBox).props.value).toEqual(true)
    });
    it('Should able to toggle the checkbox to false, when checkbox value is true', () => {
        const onPressMock = jest.fn();
        const { rerender, container } = render(
            Component({
                text: 'Select Gender',
                checked: true,
                data: false,
                onPress: onPressMock,
            }),
        );
        fireEvent(container.findByType(CheckBox), 'onChange');
        rerender(
            Component({
                text: 'Select Gender',
                checked: false,
                data: false,
                onPress: onPressMock,
            }),
        );
        expect(container.findByType(CheckBox).props.value).toEqual(false)
        expect(onPressMock).toBeCalledWith(false);
    });
    it('Should not call onPress, when props is not defined', () => {
        const onPressMock = jest.fn();
        const { container } = render(
            Component({
                text: 'Select Gender',
                checked: false,
                data: false,
            }),
        );
        const checkbox = container.findByType(CheckBox);
        fireEvent(checkbox, 'onChange');
        expect(checkbox.props.checked).toBeFalsy();
        expect(onPressMock).not.toBeCalled();
    });
});
