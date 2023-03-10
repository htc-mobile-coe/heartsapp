import React from 'react';
import RadioButtonList from './RadioButtonList';
import Radio from 'app/views/shared/Radio';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('RadioButtonList', () => {
    const seekersList = [{ id: 1, name: 'Hemadevi Peri' }];
    const selectedSeekersOnDropDown = [{ id: 1, name: 'Hemadevi Peri' }];
    const Component = props => {
        return render(<RadioButtonList {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a Radio Button component', () => {
        const { container } = Component({
            seekersList,
            selectedSeekersOnDropDown,
        });
        expect(container.findByType(Radio)).toBeDefined();
    });
    it('Should call onRadioButtonPress when user press radioButton', () => {
        const onRadioButtonPressMock = jest.fn();
        const { container } = Component({
            seekersList: [{ id: 1, name: 'Hemadevi Peri', isSelected: true }],
            selectedSeekersOnDropDown: [{ id: 2, name: 'Vijayan Pambhatla' }],
            onRadioButtonPress: onRadioButtonPressMock,
        });
        fireEvent(container.findByType(Radio), 'Press');
        expect(onRadioButtonPressMock).toHaveBeenCalled();
    });
});
