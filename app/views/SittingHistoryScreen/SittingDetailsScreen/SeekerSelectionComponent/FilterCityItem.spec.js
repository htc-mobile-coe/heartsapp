import React from 'react';
import FilterCityItem from './FilterCityItem';
import { MediumBoldText } from '../../../shared/Text';
import CityPicker from '../../../shared/CityPicker';
import { render } from 'app/utils/TestUtils';

describe('FilterForm', () => {
    const Component = props => {
        return render(<FilterCityItem id="CITY" {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should render 1 CityPicker component', () => {
        const { container } = Component({});
        expect(container.findByType(CityPicker)).toBeDefined();
    });
    it('Should render 1 MediumBoldText component', () => {
        const { container } = Component({});
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
});
