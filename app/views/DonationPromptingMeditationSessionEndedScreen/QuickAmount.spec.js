import React from 'react';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import QuickAmount from './QuickAmount';
import { Text } from '../shared';
import { TouchableOpacity } from 'react-native';

describe('QuickAmount', () => {
    const Component = (props) => {
        return render(<QuickAmount
            {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a TouchableOpacity component to handle amount press event', async () => {
        const { container } = Component();
        await expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should handle onQuickAmountPress event, when quick amount button is pressed', () => {
        const onQuickAmountPressMock = jest.fn();
        const { container } = Component({
            onQuickAmountPress: onQuickAmountPressMock,
        });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onQuickAmountPressMock).toHaveBeenCalled();
    });

    it('Should have 1 Text component to show amount', async () => {
        const { container } = Component();
        await expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should show amount in Text', () => {
        const { container } = Component({
            amount: 100,
        });
        expect(findByProps(container, 'amount', 100)).toBeDefined();
    });
});
