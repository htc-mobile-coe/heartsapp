import React from 'react';
import EmailForm from './EmailForm';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Button, Input } from '../shared';
import { ActivityIndicator } from 'react-native';

describe('EmailForm', () => {
    const sendButton = 'shareHistoryPoup__send--button';
    const handleChangeMock = jest.fn();
    const emailMock = 'preceptor.55@mailinator.com';

    const Component = props => {
        return render(<EmailForm
            {...props}
            errors={'Invalid email'}
            handleChange={handleChangeMock}
            email={emailMock}
        />);
    };

    it('By default should render properly', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 Input component for entering email', () => {
        const { container } = Component({});
        expect(container.findByType(Input)).toBeDefined();
    });

    it('Should have email value for Input component', () => {
        const { container } = Component();
        expect(container.findByType(Input)).toHaveProp('value', 'preceptor.55@mailinator.com');
    });

    it('Should have a button component when showShareHisoryLoader is false', () => {
        const { container } = Component({
            showShareHisoryLoader: false,
        });
        expect(container.findByType(Button)).toBeDefined();
    });

    it('Should have a ActivityIndicator component when showShareHisoryLoader is true', () => {
        const { container } = Component({
            showShareHisoryLoader: true,
        });
        expect(container.findByType(ActivityIndicator)).toBeDefined();
    });

    it('Should call handleSubmit when confirm button is pressed ', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            showShareHisoryLoader: false,
            handleSubmit: handleSubmitMock,
        });
        fireEvent(find(container, sendButton), 'Press');
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});
