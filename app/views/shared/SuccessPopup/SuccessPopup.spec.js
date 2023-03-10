import React from 'react';
import SuccessPopup from './SuccessPopup';
import { Text } from '../../shared';
import { render, fireEvent } from 'TestUtils';
import { Check as CheckIcon } from '../../shared/Icon';

describe('SuccessPopup', () => {
    const Component = props => {
        return render(<SuccessPopup {...props} />) 
    };

    it('Should exist', () => {
        const {container} = Component({});
        expect(container).toBeDefined();
    });

    it('Should have a Text component', () => {
        const {container} = Component();
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have a CheckIcon component', () => {
        const {container} = Component();
        expect(container.findByType(CheckIcon)).toBeDefined();
    });
});
