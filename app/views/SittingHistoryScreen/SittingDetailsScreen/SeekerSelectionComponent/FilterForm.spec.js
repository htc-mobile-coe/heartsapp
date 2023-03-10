import React from 'react';
import FilterForm from './FilterForm';
import FilterItem from './FilterItem';
import { Button } from '../../../shared';
import { fireEvent, render, find } from 'app/utils/TestUtils';
import CityFilterItem from './CityFilterItem';

describe('FilterForm', () => {
    const searchButton = 'filterForm__search--button';
    const errorMessageText = 'filterForm__errorMessage--text';
    const valuesMock = {
        name: {
            id: 'NAME',
            label: 'name',
            searchText: '',
        },
        abhyasiId: {
            id: 'ABHYASI_ID',
            label: 'abhyasiId',
            searchText: '',
        },
        phoneNo: {
            id: 'PHONE_NO',
            label: 'phoneNo',
            searchText: '',
        },
        email: {
            id: 'EMAIL',
            label: 'email',
            searchText: '',
        },
        city: {
            id: 'CITY',
            label: 'city',
            searchText: '',
        },
    };
    const errors = {
        name: {
            searchText: 'Invalid value',
        },
        abhyasiId: {
            searchText: 'Invalid value',
        },
        phoneNo: {
            searchText: 'Invalid phone number',
        },
        email: {
            searchText: 'Invalid email',
        },
        city: {
            searchText: 'Invalid value',
        },
    };
    const handleChangeMock = jest.fn();

    const Component = props => {
        return render(<FilterForm
            {...props}
            values={valuesMock}
            handleChange={handleChangeMock}
        />);
    };

    it('Should exist', () => {
        const { container } = Component({ errors });
        expect(container).toBeDefined();
    });

    it('Should render 4 FilterItem component for name, abhyasi id, phone number and email', () => {
        const { container } = Component({ errors });
        expect(container.findAllByType(FilterItem)).toHaveLength(4);
    });
    it('Should render 1 CityFilterItem component for search text', () => {
        const { container } = Component({ errors });
        expect(container.findByType(CityFilterItem)).toBeDefined();
    });
    it('Should render 1 Button component for search', () => {
        const { container } = Component({ errors });
        expect(container.findByType(Button)).toBeDefined();
    });

    it('Should render an errorMessageText component when there is a form validation error', () => {
        const { container } = Component({
            errors: {
                errorMessage: 'Please enter at least one value to search',
            },
        });
        expect(find(container, errorMessageText)).toBeDefined();
    });

    it('Should call handleSubmit when search button is pressed', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            errors,
            handleSubmit: handleSubmitMock,
        });
        fireEvent(find(container, searchButton), 'Press');
        expect(handleSubmitMock).toBeCalled();
    });
});
