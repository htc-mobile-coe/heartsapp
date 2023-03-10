import React from 'react';
import CityListItem from './CityListItem';
import { render, fireEvent, find } from 'TestUtils';

describe('CityListItem', () => {
    const item = { formattedAddress: 'Chennai,Tamil Nadu', id: 14243 };
    const cityNameText = 'cityListItem__cityName--text';
    const cityItem = 'cityListItem_cityList--Item';

    const Component = (props) => {
        return render(<CityListItem {...props} />);
    };
    it('Should have a cityNameText for rendering city name', () => {
        const { container } = Component({
            item,
        });
        expect(find(container, cityNameText)).toBeDefined();
    });
    it('Should have a cityItem component for rendering city name and location icon', () => {
        const { container } = Component({
            item,
        });
        expect(find(container, cityItem)).toBeDefined();
    });
    it('Should call onPress when user selects a city from the list', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            item,
            onPress: onPressMock,
        });
        fireEvent.press(find(container, cityItem), item);

        expect(onPressMock).toHaveBeenCalledWith(item);
    });
});
