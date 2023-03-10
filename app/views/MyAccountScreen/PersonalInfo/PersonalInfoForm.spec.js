import React from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Button, MediumBoldText, Input } from '../../shared';
import CityPicker from '../../shared/CityPicker';

describe('PersonalInfoForm', () => {
    const updateButton = 'personalInfoScreen__update--button';
    const errorMessageText = 'personalInfoScreen__errorMessage--text'
    const phoneNumberHintText = 'personalInfoScreen__phoneNumberHint--text'
    const firstName = 'user';
    const handleChangeMock = jest.fn();
    const Component = (props) => render(<PersonalInfoForm {...props} values={firstName}
        errors={firstName}
        handleChange={handleChangeMock}
    />)
    it('By default should render properly', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 2 Text component for displaying phone number hint text & errorMessage text', () => {
        const { container } = Component({
            errorMessage: 'errorMessage',
        });
        expect(find(container, phoneNumberHintText)).toBeDefined()
        expect(find(container, errorMessageText)).toBeDefined()
    });

    it('Should have 1 MediumBoldText component for displaying user email text', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should have 6 Input component for entering repective values', () => {
        const { container } = Component({
            citizenOfIndia: true,
        });
        expect(container.findAllByType(Input)).toHaveLength(6);
    });

    it('Should have 1 CityPicker component for city name selection', () => {
        const { container } = Component({});
        expect(container.findAllByType(CityPicker)).toHaveLength(1);
    });

    it('Should have a button component', () => {
        const { container } = Component({
            userProfile: {
                email: null
            }
        });
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should handle onPress event when submit button is pressed', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({ handleSubmit: handleSubmitMock, });
        fireEvent(find(container, updateButton), 'Press');
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});
