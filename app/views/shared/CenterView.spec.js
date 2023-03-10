import { View } from 'react-native';
import React from 'react';
import { render } from 'TestUtils';
import CenterView from './CenterView';

describe('CenterView ', () => {
    it('should render properly', () => {
        const { container } = render(<CenterView />);
        expect(container.findByType(View)).toHaveStyle({
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
        });
    });
});
