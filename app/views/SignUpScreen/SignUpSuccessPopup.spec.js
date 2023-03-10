import React from 'react';
import SignUpSuccessPopup from './SignUpSuccessPopup';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Text } from '../shared';
import { Image } from 'react-native';

describe('SignUpSuccessPopup', () => {
    const successImage = 'signUpSuccessPopup__successImage--image';
    const loginButton = 'signUpSuccessPopup__login--button';
    const Component = props => {
        return render(<SignUpSuccessPopup {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have OptionsScreenHeader', () => {
        const { container } = Component({});
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should render a Text component to show the message', () => {
        const { container } = Component({});
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render a successImage component', () => {
        const { container } = Component({});
        expect(find(container, successImage)).toBeDefined();
    });

    it('Should able to call back. when user tap back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');

        expect(onBackPressMock).toBeCalled();
    });

    it('Should able to call login. when user tap login button', () => {
        const loginPressMock = jest.fn();
        const { container } = Component({ onLoginPress: loginPressMock });
        fireEvent(find(container, loginButton), 'Press');

        expect(loginPressMock).toBeCalled();
    });
});
