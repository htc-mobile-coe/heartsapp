import React from 'react';
import CityFilterItem from './CityFilterItem';
import { MediumBoldText } from '../../../shared/Text';
import CityPicker from '../../../shared/CityPicker';
import { render } from 'app/utils/TestUtils';

describe('CityFilterItem', () => {
    const Component = props => {
        return render(<CityFilterItem id="CITY" {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
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
