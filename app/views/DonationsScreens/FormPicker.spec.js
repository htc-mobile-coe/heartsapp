import React from 'react';
import FormPicker from './FormPicker';
import Picker from './Picker';
import { render, fireEvent, find } from '../../utils/TestUtils';

describe('FormPicker', () => {
    const errorMessage = 'FormPicker_error--Text'
    const Component = (props) => {
        return render(<FormPicker
            {...props}
            getDisplayText={jest.fn()}
        />);
    };
    it('By default should render properly', () => {
        const { container } = Component({
            form: {
                values: {
                    firstName: 'santhosh'
                }
            },
            name: 'firstName',
            style: {
                justifyContent: 'center'
            }

        });
        expect(container).toBeDefined();
    });

    it('Should render error component, when the form has error', () => {
        const { container } = Component({
            form: {
                errors: {
                    errors: 'test'
                }
            },
            name: 'errors',
            style: {
                justifyContent: 'center'
            }

        });
        expect(find(container, errorMessage)).toBeDefined();
    });
    it('Should have a Picker component for rendering the Picker component for country and states', () => {
        const { container } = Component({
            showActivityIndicator: false,
        });
        expect(container.findAllByType(Picker)).toHaveLength(1);
    });

    it('Should handle onPickerItemSelected event, when item is selected ', () => {
        const setFieldValueMock = jest.fn();
        const onPickerItemSelectedMock = jest.fn();
        const { container } = Component({
            form: { setFieldValue: setFieldValueMock },
            onPickerItemSelected: onPickerItemSelectedMock,
        });

        expect(container.findAllByType(Picker)).toHaveLength(1);
        fireEvent(container.findByType(Picker), 'PickerItemSelected')
        expect(setFieldValueMock).toHaveBeenCalled();
    });

});
