import React from 'react';
import CheckBoxContainer from './CheckBox';
import CheckBox from '../shared/CheckBox';
import { render, fireEvent } from 'app/utils/TestUtils';
describe('CheckBox', () => {
    const Component = props => {
        return render(<CheckBoxContainer {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 CheckBox', () => {
        const { container } = Component();
        expect(container.findByType(CheckBox)).toBeDefined();
    });

    it('Should update Checkbox value when onPress', () => {
        const setFieldValuesMock = jest.fn();
        const { container } = Component({
            name: 'FieldName',
            form: { setFieldValue: setFieldValuesMock },
        });
        fireEvent.press(container.findByType(CheckBox));
        expect(setFieldValuesMock.mock.calls[0]).toEqual(['FieldName', true]);
    });
});
