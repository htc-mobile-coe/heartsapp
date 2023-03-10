import React from 'react';
import { find, render } from '../../utils/TestUtils';
import SubscriptionPopup from './SubscriptionPopup';

describe('SubscriptionPopup', () => {
    const iconGreenCircle = 'subscriptionPopup__IconGreenCircle';
    const thankYouText = 'subscriptionPopup__thankYouText';
    const messageText = 'subscriptionPopup__messageText';

    const Component = (props) => {
        return render(<SubscriptionPopup {...props} />);
    };
    it('Should have Image component', () => {
        const { container } = Component();
        expect(find(container, iconGreenCircle)).toBeDefined();
    });
    it('Should have success Title component', () => {
        const { container } = Component();
        expect(find(container, thankYouText)).toBeDefined();
    });
    it('Should have message Text component', () => {
        const { container } = Component();
        expect(find(container, messageText)).toBeDefined();
    });
});
