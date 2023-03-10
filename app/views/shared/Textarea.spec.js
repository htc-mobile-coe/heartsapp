import { TextArea } from 'native-base';
import React from 'react';
import { render } from 'TestUtils';
import TextAreaComponent from './Textarea';
import { Text } from './Text';

describe('Input ', () => {
    it('should render TextArea', () => {
        const { container } = render(<TextAreaComponent />);
        expect(container.findByType(TextArea)).toBeDefined();
    });
    it('should render styles', () => {
        const { container } = render(
            <TextAreaComponent style={{ color: '#000' }} />,
        );
        expect(container.findByType(TextArea)).toHaveStyle([
            {
                fontFamily: 'Gotham-Book',
                fontSize: 14,
            },
            { color: '#000' },
        ]);
    });
    it('should render itemStyle ', () => {
        const { container } = render(
            <TextAreaComponent
                itemStyle={{
                    width: 20,
                    height: 10,
                    borderColor: '#000',
                    borderWidth: 2,
                }}
            />,
        );
        const textArea = container.findByType(TextArea);
        expect(textArea).toHaveProp('borderColor', '#000');
        expect(textArea).toHaveProp('borderWidth', 2);
    });
    it('should render error message', () => {
        const { container } = render(<TextAreaComponent error={'error'} />);
        expect(container.findByType(Text)).toBeDefined();
    });
});
