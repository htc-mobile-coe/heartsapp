import React from 'react';
import { Image } from 'react-native';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DropDownInput from './DropDownInput';
import { Text } from 'app/views/shared/Text';
describe('DropDownInput', () => {
    const dropDownInputButton = 'multiSelectionDropdown__dropDownInput--button';

    const Component = props => {
        return render(<DropDownInput {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a Image component to display dropdown icon', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have a Text component for dropdown input', () => {
        const { container } = Component({});
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should call onPress when user press on dropDownInput button', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
        });
        fireEvent(find(container, dropDownInputButton), 'Press');
        expect(onPressMock).toHaveBeenCalled();
    });
});
