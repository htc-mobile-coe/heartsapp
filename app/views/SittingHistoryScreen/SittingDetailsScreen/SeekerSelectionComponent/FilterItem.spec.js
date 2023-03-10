import React from 'react';
import FilterItem from './FilterItem';
import { MediumBoldText, Text } from '../../../shared/Text';
import { Input } from 'native-base';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('FilterItem', () => {
    const Component = props => {
        return render(<FilterItem {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render 1 MediumBoldText component', () => {
        const { container } = Component({});
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should render 1 Input component', () => {
        const { container } = Component({});
        expect(container.findByType(Input)).toBeDefined();
    });
    it('Should render 1 Text component when there is a validation error', () => {
        const { container } = Component({
            error: {
                searchText: 'invalid value',
            },
        });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should render 1 Text component when hint is a valid', () => {
        const { container } = Component({
            hint: '+919988776655',
        });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should call onSearchOptionValueChange when search option text is changed', () => {
        const onSearchOptionValueChangeMock = jest.fn();
        const { container } = Component({
            onSearchOptionValueChange: onSearchOptionValueChangeMock,
            id: 'NAME',
        });
        fireEvent(container.findByType(Input), 'ChangeText', 'textMock');
        expect(onSearchOptionValueChangeMock).toBeCalledWith(
            'textMock',
            'NAME',
        );
    });
});
