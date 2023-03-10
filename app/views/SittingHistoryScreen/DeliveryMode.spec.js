import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DeliveryMode from './DeliveryMode';
import { Text } from '../shared/Text';

describe('DeliveryMode', () => {
    const selectDeliveryModeButton = 'deliveryMode--selectDeliveryMode-button';

    const Component = props => {
        return render(<DeliveryMode {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 Text component for title', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render title in Text component', () => {
        const { container } = Component({
            title: 'titleMock',
        });
        expect(container.findByType(Text)).toHaveProp('children', 'titleMock');
    });

    it('Should render title text style as active, when isActive is true', () => {
        const { container } = Component({
            isActive: true,
        });
        expect(container.findByType(Text)).toHaveProp('style', {
            color: '#ffffff',
            fontSize: 14,
            textAlign: 'center',
        });
    });

    it('Should render title text style as inactive, when isActive is false', () => {
        const { container } = Component({
            isActive: false,
        });
        expect(container.findByType(Text)).toHaveProp('style', {
            color: '#000000',
            fontSize: 14,
            textAlign: 'center',
        });
    });

    it('Should call onDeliveryModeSelect, when select delivery mode pressed', () => {
        const onDeliveryModeSelectMock = jest.fn();
        const { container } = Component({
            onDeliveryModeSelect: onDeliveryModeSelectMock,
        });
        fireEvent(find(container, selectDeliveryModeButton), 'Press');
        expect(onDeliveryModeSelectMock).toHaveBeenCalled();
    });
});
