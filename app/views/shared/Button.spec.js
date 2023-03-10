import React from 'react';
import { render } from 'TestUtils';
import Button from './Button';
import { Button as NBButton } from 'native-base';

import { MediumBoldText } from './Text';

describe('Button ', () => {
    const Component = (props) => render(<Button {...props} />);

    it('should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('should have NBButton', () => {
        const { container } = Component({});
        expect(container.findByType(NBButton)).toBeDefined();
    });
    it('should have MediumBoldText', () => {
        const { container } = Component({});
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
    it('should render custom style', () => {
        const { container } = Component({ textStyle: [{ color: '#000' }], borderRadius: 50, transparent: true });
        expect(container.findByType(NBButton)).toHaveStyle([
            { justifyContent: 'center', paddingVertical: 10 },
            undefined,
        ]);
    });
    it('should render default style', () => {
        const { container } = Component({ textStyle: [{ color: '#000' }] });
        expect(container.findByType(NBButton)).toHaveStyle([
            { justifyContent: 'center', paddingVertical: 10 },
            undefined,
        ]);
    });
});
