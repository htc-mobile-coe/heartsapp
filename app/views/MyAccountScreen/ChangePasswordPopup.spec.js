import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import ChangePasswordPopup from './ChangePasswordPopup';
import { Text } from '../shared';
import { Image } from 'react-native';

describe('ChangePasswordPopup', () => {
    const changePasswordOkayPress = 'changePasswordPopup__okay--button';
    const Component = (props) => render(<ChangePasswordPopup {...props} />)

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 3 Social Text component', () => {
        const { container } = Component({
            showAppleLogin: true,
        });

        expect(container.findAllByType(Text)).toHaveLength(3);
    });

    it('Should have 3 Social Icon Image component for social login users as they could not change password', () => {
        const { container } = Component({
            showAppleLogin: true,
        });
        expect(container.findAllByType(Image)).toHaveLength(3);
    });

    it('Should handle okayButtonPress event, when okay button is pressed', () => {
        const okayButtonPressMock = jest.fn();
        const { container } = Component({
            onChangePasswordOkayButtonPress: okayButtonPressMock,
        });
        expect(find(container, changePasswordOkayPress)).toBeDefined();
        fireEvent(find(container, changePasswordOkayPress), 'Press');
        expect(okayButtonPressMock).toHaveBeenCalled();
    });
});
