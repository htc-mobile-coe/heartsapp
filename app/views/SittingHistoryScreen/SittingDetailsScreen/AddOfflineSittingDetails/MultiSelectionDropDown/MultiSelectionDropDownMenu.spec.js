import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import MultiSelectionDropDownMenu from './MultiSelectionDropDownMenu';
import DropDownInput from './DropDownInput';
import RadioButtonList from './RadioButtonList';
import DottedList from './DottedList';
describe('MultiSelectionDropDownMenu', () => {
    const addSeekerIcon = 'multiSelectionDropdown__addSeeker--icon';
    const addSeekerButton = 'multiSelectionDropdown__addSeeker--button';
    const Component = props => {
        return render(<MultiSelectionDropDownMenu {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a addSeekerIcon component', () => {
        const { container } = Component();
        expect(find(container, addSeekerIcon)).toBeDefined();
    });
    it('Should have a addSeekerButton component', () => {
        const { container } = Component();
        expect(find(container, addSeekerButton)).toBeDefined();
    });
    it('Should have a DropDownInput component', () => {
        const { container } = Component({});
        expect(container.findByType(DropDownInput)).toBeDefined();
    });
    it('Should have a RadioButtonList component when drop down is expanded', () => {
        const { container } = Component({ isExpanded: true });
        expect(container.findByType(RadioButtonList)).toBeDefined();
    });
    it('Should have one DottedList component when drop down is not expanded', () => {
        const { container } = Component({
            isExpanded: false,
            selectedSeekers: [{ id: 1, name: 'Hemadevi Peri' }],
        });
        expect(container.findByType(DottedList)).toBeDefined();
    });
    it('Should call onRadioButtonPress when user press on Add seeker button', () => {
        const onRadioButtonPressMock = jest.fn();
        const { container } = Component({
            isExpanded: true,
            onRadioButtonPress: onRadioButtonPressMock,
        });
        fireEvent(container.findByType(RadioButtonList), 'RadioButtonPress');
        expect(onRadioButtonPressMock).toHaveBeenCalled();
    });
    it('Should call onSeekerSelection when user press on add image', () => {
        const onSeekerSelectionMock = jest.fn();
        const { container } = Component({
            isExpanded: true,
            onSeekerSelection: onSeekerSelectionMock,
        });
        fireEvent(find(container, addSeekerButton), 'Press');
        expect(onSeekerSelectionMock).toHaveBeenCalled();
    });
});
