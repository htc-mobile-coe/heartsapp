import { Input } from 'native-base';
import React from 'react';
import { render } from 'TestUtils';
import InputComponent from './Input';
import { Text } from './Text';

describe('Input ', () => {
    it('should render Input', () => {
        const { container } = render(<InputComponent />);
        expect(container.findByType(Input)).toBeDefined();
    });
    it('should render styles', () => {
        const { container } = render(
            <InputComponent style={{ color: '#000' }} />,
        );
        expect(container.findByType(Input)).toHaveStyle([
            {
                fontFamily: 'Gotham-Book',
                fontSize: 14,
            },
            { color: '#000' },
        ]);
    });
    it('should render itemStyle ', () => {
        const { container } = render(
            <InputComponent
                itemStyle={{
                    width: 20,
                    height: 10,
                    borderColor: '#000',
                    borderWidth: 2,
                }}
            />,
        );
        const input = container.findByType(Input);
        expect(input).toHaveProp('width', 20);
        expect(input).toHaveProp('height', 10);
        expect(input).toHaveProp('borderColor', '#000');
        expect(input).toHaveProp('borderWidth', 2);
    });
    it('should render error message', () => {
        const { container } = render(<InputComponent error={'error'} />);
        expect(container.findByType(Text)).toBeDefined();
    });
});
