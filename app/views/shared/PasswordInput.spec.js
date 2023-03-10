import { Input } from 'native-base';
import React from 'react';
import { render, fireEvent, find } from 'TestUtils';
import PasswordInput from './PasswordInput';
import { Text } from './Text';
import { Eye, EyeOff } from './Icon';

describe('Input ', () => {
    const passwordRightButton = 'password_right_button';
    it('should have Input', () => {
        const { container } = render(<PasswordInput />);
        expect(container.findByType(Input)).toBeDefined();
    });
    it('should have Eye', () => {
        const { container } = render(<PasswordInput />);
        expect(container.findByType(Eye)).toBeDefined();
    });

    it('should render itemStyle ', () => {
        const { container } = render(
            <PasswordInput
                itemStyle={{
                    width: 20,
                    height: 10,
                    borderColor: '#000',
                    borderWidth: 2,
                }}
            />,
        );
        expect(container.findByType(Input)).toHaveProp('height', 10);
        expect(container.findByType(Input)).toHaveProp('borderColor', '#000');
        expect(container.findByType(Input)).toHaveProp('borderWidth', 2);
    });
    it('should render error message', () => {
        const { container } = render(<PasswordInput error={'error'} />);
        expect(container.findByType(Text)).toBeDefined();
    });
    it('should able to show EyeOff icon', () => {
        const { container } = render(<PasswordInput />);
        fireEvent.press(find(container, passwordRightButton));
        expect(container.findByType(EyeOff)).toBeDefined();
    });
});
