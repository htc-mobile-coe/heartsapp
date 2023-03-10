import React from 'react';
import AgeConsentPopup from './index';
import { render, fireEvent, find } from 'TestUtils';
import { Text, Button } from '../';
import CheckBox from '../CheckBox';
import { TouchableOpacity } from 'react-native';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';

describe('AgeConsentPopup', () => {
    const acceptButton = 'AgeConsentPopup__accept--button';
    const cancelButton = 'AgeConsentPopup__cancel--button';

    const Component = (props) => {
     return render(<AgeConsentPopup {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 6 Text component for title, description, conjunction, terms and policy text', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(6);
    });

    it('Should have a CheckBox component', () => {
        const { container } = Component();
        expect(container.findByType(CheckBox)).toBeDefined();
    });

    it('Should have 2 TouchableOpacity component for Terms of use and Privacy Policy text', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
    });

    it('Should have 2 Button component for accept and cancel button', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(2);
    });

    it('Should call onAcceptButtonPress when user clicks on Accept Button', () => {
        const onAcceptButtonPressMock = jest.fn();
        const { container } = Component({
            onAcceptButtonPress: onAcceptButtonPressMock,
            ageConsentCheckBoxChecked: true,
        });
        fireEvent.press(find(container, acceptButton));
        expect(onAcceptButtonPressMock).toHaveBeenCalled();
    });

    it('Should call cancelButton when user clicks on cancel Button', () => {
        const onCancelButtonPressMock = jest.fn();

        const { container } = Component({
            onCancelButtonPress: onCancelButtonPressMock,
            ageConsentCheckBoxChecked: false,
        });
        fireEvent.press(find(container, cancelButton));
        expect(onCancelButtonPressMock).toHaveBeenCalled();
    });

    it('Should be disable Accept Button, when agreement checkbox is disable', () => {
        const { container } = Component({
            ageConsentCheckBoxChecked: false,
            themeMode: ThemeMode.peach,
        });

        expect(find(container, acceptButton)).toHaveStyle({
            paddingHorizontal: 8,
            backgroundColor: '#BEBEBE',
            marginEnd: 30,
        });
    });
    it('Should be disable Cancel Button, when agreement checkbox is disable', () => {
        const { container } = Component({
            ageConsentCheckBoxChecked: false,
        });
        expect(find(container, cancelButton)).toHaveStyle({
            borderColor: '#BEBEBE',
            borderWidth: 2,
            paddingHorizontal: 8,
        });
    });

    it('Should call onCheckBoxPress, when user clicks on CheckBox', () => {
        const onCheckBoxPressMock = jest.fn();

        const { container } = Component({
            ageConsentCheckBoxChecked: false,
            onCheckBoxPress: onCheckBoxPressMock,
        });
        fireEvent.press(container.findByType(CheckBox));
        expect(onCheckBoxPressMock).toHaveBeenCalledWith(true);
        expect(container.findByType(CheckBox)).toHaveProp('checked', false);
    });
});
