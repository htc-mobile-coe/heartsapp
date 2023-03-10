import React from 'react';
import { render } from '../../utils/TestUtils';
import { TouchableOpacity } from 'react-native';
import UserRoleButton from './UserRoleButton';
import { AngleRight } from '../shared/Icon';
import { Text } from 'native-base';

describe('UserRoleButton', () => {

    const Component = (props) => render(<UserRoleButton {...props} />)

    it('Should have AngleRight component', () => {
        const onPressMock = jest.fn()
        const { container } = Component(
            { onPress: onPressMock }
        );
        expect(container.findAllByType(AngleRight)).toHaveLength(1);
    });
    it('Should have Text component', () => {
        const onPressMock = jest.fn()
        const { container } = Component(
            { onPress: onPressMock }
        );
        expect(container.findAllByType(Text)).toHaveLength(1);
    });
    it('Should have TouchableOpacity component', () => {
        const onPressMock = jest.fn()
        const { container } = Component(
            { onPress: onPressMock }
        );
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });
});
